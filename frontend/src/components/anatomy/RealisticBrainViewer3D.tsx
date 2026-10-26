import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Rotate3d,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Play,
  Pause,
  Eye,
  Layers,
  Sparkles,
  Info,
  Compass,
} from 'lucide-react';
import { BrainAnatomyRegion } from '../../types';

interface RealisticBrainViewer3DProps {
  selectedRegionId: string;
  onSelectRegion: (id: string) => void;
  regions: BrainAnatomyRegion[];
  renderMode: 'cortex' | 'tracts' | 'xray';
  onChangeRenderMode: (mode: 'cortex' | 'tracts' | 'xray') => void;
  activePlane: 'Axial' | 'Sagittal' | 'Coronal';
  sliceDepth: number; // 0 to 100
  enableClipping: boolean;
  onToggleClipping: (enable: boolean) => void;
  hemisphereFilter?: 'both' | 'left' | 'right';
  onHemisphereChange?: (hemi: 'both' | 'left' | 'right') => void;
}

// Categorize mesh names in the medical GLB model into functional anatomical regions
function classifyMeshRegion(name: string): string {
  const nl = (name || '').toLowerCase();

  // Vasculature (arteries, veins, sinuses)
  if (
    nl.includes('artery') ||
    nl.includes('vein') ||
    nl.includes('sinus') ||
    nl.includes('venous') ||
    nl.includes('plexus')
  ) {
    return 'vasculature';
  }

  // Cerebellum (folia, lobules, vermis, tonsil, peduncles)
  if (
    nl.includes('cerebell') ||
    nl.includes('culmen') ||
    nl.includes('declive') ||
    nl.includes('folium') ||
    nl.includes('tuber') ||
    nl.includes('uvula') ||
    nl.includes('pyramis') ||
    nl.includes('nodule') ||
    nl.includes('flocculus') ||
    nl.includes('semilunar') ||
    nl.includes('quadrangular') ||
    nl.includes('biventral') ||
    nl.includes('gracile') ||
    nl.includes('central lobule') ||
    nl.includes('vermis') ||
    nl.includes('tonsil')
  ) {
    return 'cerebellum';
  }

  // Brainstem (Midbrain, Pons, Medulla, Olives, Colliculi, Pyramids)
  if (
    nl.includes('pons') ||
    nl.includes('medulla') ||
    nl.includes('midbrain') ||
    nl.includes('olive') ||
    nl.includes('colliculus') ||
    nl.includes('brainstem') ||
    nl.includes('peduncle') ||
    nl.includes('reticulospinal') ||
    nl.includes('corticobulbar') ||
    nl.includes('corticospinal') ||
    nl.includes('tectum') ||
    nl.includes('pyramid of medulla')
  ) {
    return 'brainstem';
  }

  // Ventricular System & CSF
  if (
    nl.includes('ventricle') ||
    nl.includes('aqueduct') ||
    nl.includes('choroid') ||
    nl.includes('septum pellucidum') ||
    nl.includes('interpeduncular')
  ) {
    return 'ventricles';
  }

  // Corpus Callosum & Commissures
  if (
    nl.includes('callosum') ||
    nl.includes('fornix') ||
    nl.includes('cingulat')
  ) {
    return 'corpus_callosum';
  }

  // Basal Ganglia, Thalamus & Diencephalon
  if (
    nl.includes('thalam') ||
    nl.includes('caudate') ||
    nl.includes('putamen') ||
    nl.includes('pallidus') ||
    nl.includes('subthalamic') ||
    nl.includes('substantia nigra') ||
    nl.includes('accumbens') ||
    nl.includes('mamillary') ||
    nl.includes('habenula') ||
    nl.includes('hypothalam') ||
    nl.includes('red nucleus') ||
    nl.includes('pulvinar') ||
    nl.includes('geniculate')
  ) {
    return 'basal_ganglia';
  }

  // Frontal Lobe (Cerebral Cortex - Anterior)
  if (
    nl.includes('frontal') ||
    nl.includes('precentral') ||
    nl.includes('orbit') ||
    nl.includes('subcallosal') ||
    nl.includes('gyrus rectus') ||
    nl.includes('olfactory sulcus') ||
    nl.includes('frontomarginal') ||
    nl.includes('paracentral') ||
    nl.includes('frontopolar') ||
    nl.includes('straight gyrus') ||
    nl.includes('opercular') ||
    nl.includes('triangular')
  ) {
    return 'frontal';
  }

  // Parietal Lobe (Cerebral Cortex - Superior/Parietal)
  if (
    nl.includes('parietal') ||
    nl.includes('postcentral') ||
    nl.includes('precuneus') ||
    nl.includes('supramarginal') ||
    nl.includes('angular') ||
    nl.includes('intraparietal') ||
    nl.includes('subparietal')
  ) {
    return 'parietal';
  }

  // Temporal Lobe (Cerebral Cortex - Lateral/Inferior)
  if (
    nl.includes('temporal') ||
    nl.includes('hippocamp') ||
    nl.includes('parahippocamp') ||
    nl.includes('uncinate') ||
    nl.includes('heschl') ||
    nl.includes('amygdal') ||
    nl.includes('occipitotemporal')
  ) {
    return 'temporal';
  }

  // Occipital Lobe (Cerebral Cortex - Posterior)
  if (
    nl.includes('occipital') ||
    nl.includes('calcarine') ||
    nl.includes('cuneus') ||
    nl.includes('lingual') ||
    nl.includes('lunate')
  ) {
    return 'occipital';
  }

  // White matter pathways & cranial nerves
  if (
    nl.includes('nerve') ||
    nl.includes('chiasm') ||
    nl.includes('tract') ||
    nl.includes('fasciculus') ||
    nl.includes('radiation') ||
    nl.includes('lemniscus') ||
    nl.includes('stria')
  ) {
    return 'tracts';
  }

  return 'cortex_other';
}

// Detect hemisphere from mesh/node name or lateral position
function getMeshHemisphere(name: string): 'left' | 'right' | 'midline' {
  const nl = (name || '').toLowerCase();
  if (
    nl.endsWith('.l') ||
    nl.includes('.l.') ||
    nl.includes(' left') ||
    nl.includes('(l)')
  ) {
    return 'left';
  }
  if (
    nl.endsWith('.r') ||
    nl.includes('.r.') ||
    nl.includes(' right') ||
    nl.includes('(r)') ||
    nl.endsWith('.001')
  ) {
    return 'right';
  }
  return 'midline';
}

// Realistic medical color palette (natural human tissue tones)
const NATURAL_TISSUE_COLORS: Record<string, string> = {
  frontal: '#cbb7a6',      // Natural pinkish cortical gray-beige
  parietal: '#c6b2a1',     // Natural parietal tan-gray
  temporal: '#c3af9e',     // Natural temporal muted beige
  occipital: '#c0ac9b',    // Natural occipital soft taupe
  cortex_other: '#c8b4a3', // General cortical gyri / sulci
  cerebellum: '#b89e8e',   // Natural cerebellar tissue tone
  brainstem: '#ddd3c6',    // Fibrous pale ivory-beige
  ventricles: '#38bdf8',   // Translucent cerebral spinal fluid
  basal_ganglia: '#beaa97',// Subcortical gray nuclei
  corpus_callosum: '#f1ede6', // Densely myelinated commissure
  pituitary: '#c48a7b',    // Muted soft glandular coral
  nerves: '#ece4d8',       // Delicate cranial nerve white
  tracts: '#e5ddd2',       // White matter pathway fiber
  vasculature: '#a84d4d',  // Subtle muted arterial tone
};

// 3D Anchor positions for projected landmark pins (scaled to centered brain model)
const ANATOMICAL_PINS = [
  { id: 'frontal', name: 'Frontal Lobe', pos: new THREE.Vector3(0.0, 0.45, 1.05) },
  { id: 'parietal', name: 'Parietal Lobe', pos: new THREE.Vector3(0.0, 1.00, -0.20) },
  { id: 'temporal', name: 'Temporal Lobe', pos: new THREE.Vector3(0.95, -0.15, 0.25) },
  { id: 'occipital', name: 'Occipital Lobe', pos: new THREE.Vector3(0.0, 0.45, -1.05) },
  { id: 'cerebellum', name: 'Cerebellum', pos: new THREE.Vector3(0.0, -0.65, -0.75) },
  { id: 'brainstem', name: 'Brainstem', pos: new THREE.Vector3(0.0, -0.90, -0.05) },
];

export const RealisticBrainViewer3D: React.FC<RealisticBrainViewer3DProps> = ({
  selectedRegionId,
  onSelectRegion,
  regions,
  renderMode,
  onChangeRenderMode,
  hemisphereFilter = 'both',
  onHemisphereChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // Loading & Error States
  const [loading, setLoading] = useState<boolean>(true);
  const [loadProgress, setLoadProgress] = useState<number>(15);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Viewer Controls State
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<string>('iso');
  const [hoveredInfo, setHoveredInfo] = useState<{ name: string; regionId: string } | null>(null);

  // Pin projections state (2D screen coordinates)
  const [projectedPins, setProjectedPins] = useState<
    Array<{ id: string; name: string; x: number; y: number; visible: boolean }>
  >([]);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const brainGroupRef = useRef<THREE.Group | null>(null);
  const meshesRef = useRef<
    Array<{
      mesh: THREE.Mesh;
      regionId: string;
      hemisphere: string;
      origMaterial: THREE.MeshStandardMaterial;
    }>
  >([]);
  const animFrameRef = useRef<number | null>(null);

  // Camera glide animation target
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);

  // Pointer interaction refs to differentiate clicks from orbit drags
  const pointerDownPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());

  // Helper to build procedural 3D brain mesh fallback if GLB asset fails
  const buildProceduralBrainFallback = useCallback((parentGroup: THREE.Group) => {
    const fallbackList: Array<{
      mesh: THREE.Mesh;
      regionId: string;
      hemisphere: string;
      origMaterial: THREE.MeshStandardMaterial;
    }> = [];

    const createPart = (
      geo: THREE.BufferGeometry,
      regionId: string,
      hemi: 'left' | 'right' | 'midline',
      name: string,
      pos: THREE.Vector3,
      scale: THREE.Vector3,
      rot?: THREE.Euler
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(NATURAL_TISSUE_COLORS[regionId] || '#cbb7a6'),
        roughness: regionId === 'cerebellum' ? 0.65 : 0.52,
        metalness: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = name;
      mesh.position.copy(pos);
      mesh.scale.copy(scale);
      if (rot) mesh.rotation.copy(rot);
      parentGroup.add(mesh);
      fallbackList.push({ mesh, regionId, hemisphere: hemi, origMaterial: mat });
    };

    // Both Cerebral Hemispheres (Left & Right)
    [-1, 1].forEach((sign) => {
      const hemi = sign < 0 ? 'left' : 'right';
      const hName = sign < 0 ? 'Left' : 'Right';
      const xOffset = sign * 0.45;

      // Frontal Lobe
      createPart(
        new THREE.SphereGeometry(0.52, 28, 24),
        'frontal',
        hemi,
        `${hName} Frontal Lobe`,
        new THREE.Vector3(xOffset, 0.25, 0.45),
        new THREE.Vector3(0.85, 0.95, 1.1)
      );

      // Parietal Lobe
      createPart(
        new THREE.SphereGeometry(0.5, 28, 24),
        'parietal',
        hemi,
        `${hName} Parietal Lobe`,
        new THREE.Vector3(xOffset, 0.5, -0.15),
        new THREE.Vector3(0.85, 0.9, 0.95)
      );

      // Temporal Lobe
      createPart(
        new THREE.SphereGeometry(0.44, 28, 24),
        'temporal',
        hemi,
        `${hName} Temporal Lobe`,
        new THREE.Vector3(sign * 0.55, -0.15, 0.2),
        new THREE.Vector3(0.8, 0.85, 1.15)
      );

      // Occipital Lobe
      createPart(
        new THREE.SphereGeometry(0.42, 28, 24),
        'occipital',
        hemi,
        `${hName} Occipital Lobe`,
        new THREE.Vector3(xOffset * 0.85, 0.2, -0.65),
        new THREE.Vector3(0.85, 0.9, 0.9)
      );

      // Cerebellum Hemisphere
      createPart(
        new THREE.SphereGeometry(0.38, 24, 20),
        'cerebellum',
        hemi,
        `${hName} Cerebellar Hemisphere`,
        new THREE.Vector3(sign * 0.38, -0.5, -0.52),
        new THREE.Vector3(1.0, 0.85, 0.95)
      );
    });

    // Brainstem (Midbrain, Pons & Medulla at midline)
    createPart(
      new THREE.CylinderGeometry(0.18, 0.14, 0.75, 24),
      'brainstem',
      'midline',
      'Brainstem (Pons & Medulla)',
      new THREE.Vector3(0, -0.65, -0.05),
      new THREE.Vector3(1, 1, 1)
    );

    meshesRef.current = fallbackList;
  }, []);

  // 1. Initialize Three.js Scene, Camera, Renderer & OrbitControls
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 580;

    // Create Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup with optimal view distance and FOV
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(2.4, 1.2, 2.4);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // WebGL Renderer with ACESFilmic Tone Mapping for realistic medical rendering
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls for intuitive 3D orbit rotation, smooth zoom, and pan
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.minDistance = 1.4;
    controls.maxDistance = 6.0;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Clinical Studio Lighting Setup
    // Key Light: warm surgical light
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.6);
    keyLight.position.set(4, 7, 5);
    scene.add(keyLight);

    // Fill Light: soft cool diffuse light
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.9);
    fillLight.position.set(-5, -2, -3);
    scene.add(fillLight);

    // Rim Light: delineates sulcal/gyral contours
    const rimLight = new THREE.DirectionalLight(0xbae6fd, 1.1);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Ventral Light: illuminates cerebellum and brainstem
    const ventralLight = new THREE.DirectionalLight(0xffedd5, 0.7);
    ventralLight.position.set(0, -6, 2);
    scene.add(ventralLight);

    // Soft Ambient Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xf8fafc, 0x0f172a, 0.7);
    scene.add(hemiLight);

    // Master Brain Group centered at (0, 0, 0)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);
    brainGroupRef.current = brainGroup;

    // 2. Load Real Anatomical GLB 3D Asset with Draco Decompression
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${import.meta.env.BASE_URL}draco/`);
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    setLoadProgress(30);

    gltfLoader.load(
      `${import.meta.env.BASE_URL}models/brain.glb`,
      (gltf) => {
        setLoadProgress(90);
        const model = gltf.scene;
        const loadedMeshList: Array<{
          mesh: THREE.Mesh;
          regionId: string;
          hemisphere: string;
          origMaterial: THREE.MeshStandardMaterial;
        }> = [];

        // Traverse model meshes and classify functional regions
        const box = new THREE.Box3();

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const meshName = mesh.name || child.name || '';
            const regionId = classifyMeshRegion(meshName);
            const hemi = getMeshHemisphere(meshName);

            // Compute smooth vertex normals for high-fidelity surface rendering
            if (mesh.geometry) {
              mesh.geometry.computeVertexNormals();
            }

            // Exclude peripheral descending nerves/vessels from core parenchyma bounding box
            if (regionId !== 'vasculature' && regionId !== 'tracts') {
              box.expandByObject(mesh);
            }

            const baseHex =
              NATURAL_TISSUE_COLORS[regionId] || NATURAL_TISSUE_COLORS.cortex_other;
            const pbrMaterial = new THREE.MeshStandardMaterial({
              color: new THREE.Color(baseHex),
              roughness: regionId === 'cerebellum' ? 0.62 : regionId === 'brainstem' ? 0.48 : 0.54,
              metalness: 0.04,
              flatShading: false,
            });

            mesh.material = pbrMaterial;
            mesh.castShadow = false;
            mesh.receiveShadow = false;

            loadedMeshList.push({
              mesh,
              regionId,
              hemisphere: hemi,
              origMaterial: pbrMaterial,
            });
          }
        });

        if (box.isEmpty()) {
          box.setFromObject(model);
        }

        // Center and scale the model so the entire brain fits perfectly in viewport
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        // Scale to standard view diameter (~2.2 units)
        const targetScale = 2.2 / maxDim;
        model.scale.set(targetScale, targetScale, targetScale);

        // Position model so its anatomical center aligns precisely at (0, 0, 0)
        model.position.set(
          -center.x * targetScale,
          -center.y * targetScale,
          -center.z * targetScale
        );

        meshesRef.current = loadedMeshList;
        brainGroup.add(model);

        setLoadProgress(100);
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          const pct = Math.min(95, Math.round((xhr.loaded / xhr.total) * 100));
          setLoadProgress(pct);
        }
      },
      (error) => {
        console.warn('GLB asset loading encountered an issue, initializing procedural anatomical 3D fallback:', error);
        buildProceduralBrainFallback(brainGroup);
        setLoading(false);
      }
    );

    // 3. Responsive Resize Handler via ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    });
    resizeObserver.observe(container);

    // 4. Animation / Render Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation toward preset viewpoints
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.08);
        controlsRef.current.target.set(0, 0, 0);
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.02) {
          targetCamPosRef.current = null;
        }
      }

      // Update OrbitControls with damping and auto-rotation
      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Project 3D anatomical annotation pins to 2D screen coordinates
      if (cameraRef.current && container) {
        const cam = cameraRef.current;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const camDir = new THREE.Vector3();
        cam.getWorldDirection(camDir);

        const pins = ANATOMICAL_PINS.map((pin) => {
          const worldPos = pin.pos.clone();
          const camToPoint = worldPos.clone().sub(cam.position).normalize();
          const dot = camToPoint.dot(camDir);

          const projected = worldPos.clone().project(cam);
          const x = (projected.x * 0.5 + 0.5) * w;
          const y = (-(projected.y * 0.5) + 0.5) * h;

          return {
            id: pin.id,
            name: pin.name,
            x: Math.round(x),
            y: Math.round(y),
            visible: dot > 0.25 && projected.z < 1.0,
          };
        });
        setProjectedPins(pins);
      }

      // Render Scene
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (controlsRef.current) controlsRef.current.dispose();
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      dracoLoader.dispose();
    };
  }, [buildProceduralBrainFallback]);

  // 5. Update OrbitControls autoRotate property
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
      controlsRef.current.autoRotateSpeed = 1.6;
    }
  }, [autoRotate]);

  // 6. Update Mesh Materials and Visibility on Region Selection & View Mode Changes
  useEffect(() => {
    if (!meshesRef.current.length) return;

    meshesRef.current.forEach(({ mesh, regionId, hemisphere }) => {
      // Hemisphere filter (Bilateral / Left / Right)
      if (hemisphereFilter === 'left' && hemisphere === 'right') {
        mesh.visible = false;
        return;
      }
      if (hemisphereFilter === 'right' && hemisphere === 'left') {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;

      // Hide fine vasculature and nerve fibers in default surface cortex mode for clean visualization
      if (renderMode === 'cortex') {
        if (regionId === 'vasculature' || regionId === 'tracts') {
          mesh.visible = false;
          return;
        }
      }

      const mat = mesh.material as THREE.MeshStandardMaterial;
      const isSelected = regionId === selectedRegionId;

      if (renderMode === 'xray') {
        // Internal & CSF mode: Outer cortex becomes frosted translucent glass
        const isInternal = [
          'ventricles',
          'basal_ganglia',
          'corpus_callosum',
          'brainstem',
        ].includes(regionId);

        if (isInternal) {
          mesh.visible = true;
          mat.transparent = regionId === 'ventricles';
          mat.opacity = regionId === 'ventricles' ? 0.85 : 1.0;
          mat.depthWrite = true;
          mat.color.set(
            isSelected
              ? '#38bdf8'
              : NATURAL_TISSUE_COLORS[regionId] || '#38bdf8'
          );
          mat.emissive.set(isSelected ? '#0284c7' : '#000000');
          mat.emissiveIntensity = isSelected ? 0.4 : 0;
        } else {
          // Frosted translucent outer surface
          mat.transparent = true;
          mat.opacity = 0.18;
          mat.depthWrite = false;
          mat.color.set('#cbd5e1');
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
        }
      } else {
        // Surface Cortex Mode
        const isInternal = ['ventricles', 'basal_ganglia'].includes(regionId);
        if (isInternal) {
          mesh.visible = isSelected;
        }

        mat.transparent = false;
        mat.opacity = 1.0;
        mat.depthWrite = true;

        const baseHex =
          NATURAL_TISSUE_COLORS[regionId] || NATURAL_TISSUE_COLORS.cortex_other;

        if (isSelected) {
          // Soft warm gold highlight for actively selected anatomical region
          mat.color.set('#fef08a');
          mat.emissive.set('#ca8a04');
          mat.emissiveIntensity = 0.35;
          mat.roughness = 0.45;
        } else {
          mat.color.set(baseHex);
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
          mat.roughness = regionId === 'cerebellum' ? 0.62 : 0.54;
        }
      }
    });
  }, [selectedRegionId, renderMode, hemisphereFilter]);

  // 7. Camera View Presets
  const setCameraPreset = useCallback(
    (
      preset:
        | 'iso'
        | 'anterior'
        | 'lateral_left'
        | 'lateral_right'
        | 'superior'
        | 'inferior'
        | 'posterior'
    ) => {
      setActivePreset(preset);
      const dist = 3.2;
      const targets: Record<string, THREE.Vector3> = {
        iso: new THREE.Vector3(2.2, 1.1, 2.2),
        anterior: new THREE.Vector3(0, 0.2, dist),
        lateral_left: new THREE.Vector3(dist, 0.1, 0),
        lateral_right: new THREE.Vector3(-dist, 0.1, 0),
        superior: new THREE.Vector3(0, dist, 0.01),
        inferior: new THREE.Vector3(0, -dist, 0.01),
        posterior: new THREE.Vector3(0, 0.2, -dist),
      };
      targetCamPosRef.current = targets[preset] || targets.iso;
    },
    []
  );

  // 8. Pointer Handlers for Click Selection vs Drag Orbit
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !meshesRef.current.length) return;

    // Distinguish click from orbit drag (< 6px movement)
    const deltaX = Math.abs(e.clientX - pointerDownPosRef.current.x);
    const deltaY = Math.abs(e.clientY - pointerDownPosRef.current.y);
    if (deltaX > 6 || deltaY > 6) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(
      new THREE.Vector2(mouseX, mouseY),
      cameraRef.current
    );
    const visibleMeshes = meshesRef.current
      .filter((m) => m.mesh.visible)
      .map((m) => m.mesh);
    const intersects = raycasterRef.current.intersectObjects(visibleMeshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const item = meshesRef.current.find((m) => m.mesh === hitMesh);
      if (item && item.regionId && item.regionId !== 'cortex_other') {
        onSelectRegion(item.regionId);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container || !cameraRef.current || !meshesRef.current.length) return;

    const rect = container.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(
      new THREE.Vector2(mouseX, mouseY),
      cameraRef.current
    );
    const visibleMeshes = meshesRef.current
      .filter((m) => m.mesh.visible)
      .map((m) => m.mesh);
    const intersects = raycasterRef.current.intersectObjects(visibleMeshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const item = meshesRef.current.find((m) => m.mesh === hitMesh);
      if (item) {
        const regionName =
          regions.find((r) => r.id === item.regionId)?.name || item.regionId;
        setHoveredInfo({
          name: hitMesh.name.replace(/\.l$|\.r$|\.001$/i, ''),
          regionId: regionName,
        });
      }
    } else {
      setHoveredInfo(null);
    }
  };

  // Step Zoom Buttons
  const handleZoom = (factor: number) => {
    if (!cameraRef.current || !controlsRef.current) return;
    const newPos = cameraRef.current.position.clone().multiplyScalar(factor);
    const dist = newPos.length();
    if (dist >= 1.4 && dist <= 6.0) {
      targetCamPosRef.current = newPos;
    }
  };

  // Reset Camera View
  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.target.set(0, 0, 0);
    }
    setCameraPreset('iso');
  };

  return (
    <div className="relative w-full h-[580px] bg-[#090d16] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl select-none">
      {/* 3D Canvas Mount Point with OrbitControls */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#090d16]/95 backdrop-blur-md flex flex-col items-center justify-center space-y-4 z-40">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
            <Rotate3d className="w-7 h-7 text-teal-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <div className="text-center space-y-1.5">
            <span className="text-sm font-bold text-white tracking-wide block font-mono">
              Loading 3D Human Brain Anatomy
            </span>
            <span className="text-xs text-slate-400 block font-mono">
              Decompressing 4.6 MB Draco Cerebral Model • {loadProgress}%
            </span>
            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-auto mt-2">
              <div
                className="h-full bg-teal-400 transition-all duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {loadError && (
        <div className="absolute top-4 left-4 right-4 bg-rose-950/80 border border-rose-700/50 rounded-xl p-3 text-xs text-rose-300 flex items-center justify-between z-30">
          <span>{loadError}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 bg-rose-900/60 rounded border border-rose-600/50 hover:bg-rose-800 text-white font-mono"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top Left: Active Structure Badge */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center space-x-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl px-3.5 py-2 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.6)] animate-pulse" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 block font-bold">
              3D Human Neuroanatomy
            </span>
            <span className="text-xs font-bold text-white block">
              {regions.find((r) => r.id === selectedRegionId)?.name || 'Cerebral Cortex'}
            </span>
          </div>
        </div>

        {/* Hover Inspection Tooltip */}
        {hoveredInfo && (
          <div className="bg-slate-950/90 border border-teal-500/40 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 shadow-xl font-mono flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="font-semibold text-white">{hoveredInfo.name}</span>
            <span className="text-slate-500">({hoveredInfo.regionId})</span>
          </div>
        )}
      </div>

      {/* Top Right: Camera Presets & View Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-1.5 shadow-xl">
        <button
          type="button"
          onClick={() => setCameraPreset('iso')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'iso'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Perspective View"
        >
          Perspective
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('anterior')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'anterior'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Anterior (Frontal) View"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('lateral_left')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'lateral_left'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Left Lateral View"
        >
          Left
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('lateral_right')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'lateral_right'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Right Lateral View"
        >
          Right
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('superior')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'superior'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Superior (Dorsal) View"
        >
          Superior
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('inferior')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'inferior'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Inferior (Ventral) View"
        >
          Inferior
        </button>
        <button
          type="button"
          onClick={() => setCameraPreset('posterior')}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
            activePreset === 'posterior'
              ? 'bg-teal-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Posterior (Occipital) View"
        >
          Posterior
        </button>
      </div>

      {/* Floating 3D Projected Landmark Pins */}
      {showLabels && !loading && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {projectedPins.map((pin) => {
            if (!pin.visible) return null;
            const isSelected = pin.id === selectedRegionId;
            return (
              <div
                key={pin.id}
                style={{
                  left: `${pin.x}px`,
                  top: `${pin.y}px`,
                  transform: 'translate(-50%, -100%)',
                }}
                className="absolute pointer-events-auto transition-opacity duration-150"
              >
                <button
                  type="button"
                  onClick={() => onSelectRegion(pin.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shadow-xl border backdrop-blur-md transition-all ${
                    isSelected
                      ? 'bg-teal-500 text-slate-950 border-teal-300 font-bold scale-105 shadow-teal-glow'
                      : 'bg-slate-900/85 text-slate-200 border-slate-700/80 hover:border-teal-400 hover:text-white'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? 'bg-slate-950' : 'bg-teal-400'
                    }`}
                  />
                  <span>{pin.name}</span>
                </button>
                <div className="w-[1.5px] h-3 bg-teal-400/60 mx-auto" />
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: View Mode Toggle & Hemisphere Filter */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-1 shadow-xl">
          <button
            type="button"
            onClick={() => onChangeRenderMode('cortex')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              renderMode === 'cortex'
                ? 'bg-teal-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Surface Cortex
          </button>
          <button
            type="button"
            onClick={() => onChangeRenderMode('xray')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              renderMode === 'xray'
                ? 'bg-teal-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Internal & CSF
          </button>

          {/* Hemisphere Filter (Left / Right / Bilateral) */}
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />
          <button
            type="button"
            onClick={() => onHemisphereChange && onHemisphereChange('both')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
              hemisphereFilter === 'both'
                ? 'text-teal-400 font-bold bg-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Show both cerebral hemispheres"
          >
            Bilateral
          </button>
          <button
            type="button"
            onClick={() => onHemisphereChange && onHemisphereChange('left')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
              hemisphereFilter === 'left'
                ? 'text-teal-400 font-bold bg-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Left hemisphere medial view"
          >
            Left Hemi
          </button>
          <button
            type="button"
            onClick={() => onHemisphereChange && onHemisphereChange('right')}
            className={`px-2 py-1 rounded text-[11px] font-mono transition-all ${
              hemisphereFilter === 'right'
                ? 'text-teal-400 font-bold bg-slate-800'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Right hemisphere medial view"
          >
            Right Hemi
          </button>
        </div>

        {/* Right: Camera Action Buttons */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl p-1 shadow-xl">
          <button
            type="button"
            onClick={() => handleZoom(0.85)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.15)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />
          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg transition-colors ${
              autoRotate
                ? 'bg-teal-500/20 text-teal-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setShowLabels(!showLabels)}
            className={`p-1.5 rounded-lg transition-colors ${
              showLabels
                ? 'bg-teal-500/20 text-teal-300'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={showLabels ? 'Hide Labels' : 'Show Labels'}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset Orientation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealisticBrainViewer3D;
