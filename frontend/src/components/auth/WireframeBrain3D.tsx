import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface WireframeBrain3DProps {
  className?: string;
}

export const WireframeBrain3D: React.FC<WireframeBrain3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.3, 3.4);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Master Group for Brain & Neural Network
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Glowing Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0a2540, 1.2);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3.5, 10);
    cyanPointLight.position.set(2, 2, 2);
    scene.add(cyanPointLight);

    const bluePointLight = new THREE.PointLight(0x3b82f6, 2.5, 10);
    bluePointLight.position.set(-2, -1, -2);
    scene.add(bluePointLight);

    // 1. Instant Procedural Neural Wireframe Model
    const proceduralGroup = new THREE.Group();
    masterGroup.add(proceduralGroup);

    // Create dual-hemisphere wireframe structures
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
    });

    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
    });

    // Left & Right Hemisphere Ellipsoids
    [-0.42, 0.42].forEach((xOffset) => {
      // Outer cortical wireframe
      const hemiGeo = new THREE.SphereGeometry(0.72, 24, 20);
      const hemiMesh = new THREE.Mesh(hemiGeo, wireMat);
      hemiMesh.position.set(xOffset, 0.12, 0);
      hemiMesh.scale.set(0.78, 0.95, 1.15);
      proceduralGroup.add(hemiMesh);

      // Inner concentrated core
      const innerMesh = new THREE.Mesh(hemiGeo, innerGlowMat);
      innerMesh.position.set(xOffset, 0.12, 0);
      innerMesh.scale.set(0.6, 0.75, 0.9);
      proceduralGroup.add(innerMesh);

      // Cerebellum representation
      const cereGeo = new THREE.SphereGeometry(0.38, 16, 14);
      const cereMesh = new THREE.Mesh(cereGeo, wireMat);
      cereMesh.position.set(xOffset * 0.8, -0.5, -0.42);
      cereMesh.scale.set(0.9, 0.8, 0.85);
      proceduralGroup.add(cereMesh);
    });

    // Brainstem representation
    const stemGeo = new THREE.CylinderGeometry(0.16, 0.12, 0.7, 16);
    const stemMesh = new THREE.Mesh(stemGeo, wireMat);
    stemMesh.position.set(0, -0.58, -0.05);
    proceduralGroup.add(stemMesh);

    // 2. Synaptic Glowing Node Particles Cloud
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Scatter in brain-shaped dual ellipsoid volume
      const hemiSign = Math.random() > 0.5 ? 1 : -1;
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.3 + 0.6 * Math.cbrt(u);

      const px = hemiSign * 0.42 + r * 0.68 * Math.sin(phi) * Math.cos(theta);
      const py = 0.12 + r * 0.82 * Math.sin(phi) * Math.sin(theta);
      const pz = r * 0.98 * Math.cos(phi);

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.038,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    proceduralGroup.add(particlePoints);

    // 3. Ambient Orbiting Starfield / Neural Dust
    const ambientCount = 120;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    for (let i = 0; i < ambientCount; i++) {
      const r = 1.6 + Math.random() * 1.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      ambientPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      ambientPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ambientPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMat = new THREE.PointsMaterial({
      color: 0x06b6d4,
      size: 0.022,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // 4. Asynchronously Load High-Res GLB Brain if available and fade in
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    let glbLoadedMeshGroup: THREE.Group | null = null;

    gltfLoader.load(
      '/models/brain.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3();

        // Convert all meshes into futuristic cyan wireframes
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const name = (mesh.name || child.name || '').toLowerCase();
            // Filter out long peripheral nerves
            if (!name.includes('vagus') && !name.includes('plexus')) {
              box.expandByObject(mesh);
            }

            mesh.material = new THREE.MeshBasicMaterial({
              color: 0x06b6d4,
              wireframe: true,
              transparent: true,
              opacity: 0.32,
              blending: THREE.AdditiveBlending,
            });
          }
        });

        if (box.isEmpty()) {
          box.setFromObject(model);
        }

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2.3 / maxDim;

        model.scale.set(scale, scale, scale);
        model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

        glbLoadedMeshGroup = new THREE.Group();
        glbLoadedMeshGroup.add(model);
        masterGroup.add(glbLoadedMeshGroup);

        // Gently reduce procedural opacity to blend with high-res model
        wireMat.opacity = 0.12;
        innerGlowMat.opacity = 0.08;
      },
      undefined,
      () => {
        // Procedural wireframe continues seamlessly on fallback
      }
    );

    // Mouse Parallax Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = normX * 0.35;
      targetRotationX = normY * 0.2;
    };
    window.addEventListener('pointermove', handlePointerMove);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous futuristic holographic rotation
      masterGroup.rotation.y += 0.0035;

      // Subtle breathing motion
      const breathing = 1 + Math.sin(elapsed * 1.5) * 0.015;
      masterGroup.scale.set(breathing, breathing, breathing);

      // Smooth mouse parallax lerp
      masterGroup.rotation.y += (targetRotationY - masterGroup.rotation.y) * 0.03;
      masterGroup.rotation.x += (targetRotationX - masterGroup.rotation.x) * 0.03;

      // Slow drift for ambient neural dust
      ambientPoints.rotation.y -= 0.001;
      ambientPoints.rotation.x = Math.sin(elapsed * 0.5) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (renderer.domElement && container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      dracoLoader.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full flex items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="w-full h-full pointer-events-auto cursor-grab active:cursor-grabbing" />
    </div>
  );
};

export default WireframeBrain3D;
