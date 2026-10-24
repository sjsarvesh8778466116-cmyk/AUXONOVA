import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = r"frontend/public/samples"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_base_mri(w=256, h=256, orientation="axial"):
    # Create realistic dark background and skull/parenchyma contour
    img = np.zeros((h, w), dtype=np.float32)
    cy, cx = h // 2, w // 2
    
    # Generate brain oval/contour
    y, x = np.ogrid[:h, :w]
    if orientation == "axial":
        rx, ry = w * 0.36, h * 0.42
    elif orientation == "coronal":
        rx, ry = w * 0.38, h * 0.38
    else: # sagittal
        rx, ry = w * 0.42, h * 0.38
        
    dist_sq = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    brain_mask = dist_sq <= 1.0
    
    # Skull bone (bright rim on CT, dark on MRI T1/T2, with scalp tissue)
    scalp_mask = (dist_sq <= 1.08) & (dist_sq > 0.98)
    subdural_csf = (dist_sq <= 0.98) & (dist_sq > 0.93)
    cortex_region = (dist_sq <= 0.93) & (dist_sq > 0.65)
    white_matter = dist_sq <= 0.65
    
    # Intensities
    img[scalp_mask] = 0.45
    img[subdural_csf] = 0.08
    img[cortex_region] = 0.55
    img[white_matter] = 0.70
    
    # Add subtle gyri / sulcal variations
    np.random.seed(42)
    noise = np.random.normal(0, 0.04, (h, w))
    img[brain_mask] += noise[brain_mask]
    
    # Add lateral ventricles
    if orientation == "axial":
        # Butterfly-shaped anterior/posterior horns
        v_left = (((x - (cx - 16)) / 8) ** 2 + ((y - (cy - 10)) / 28) ** 2 <= 1.0)
        v_right = (((x - (cx + 16)) / 8) ** 2 + ((y - (cy - 10)) / 28) ** 2 <= 1.0)
        img[v_left | v_right] = 0.10
    elif orientation == "coronal":
        v_left = (((x - (cx - 14)) / 10) ** 2 + ((y - (cy - 15)) / 22) ** 2 <= 1.0)
        v_right = (((x - (cx + 14)) / 10) ** 2 + ((y - (cy - 15)) / 22) ** 2 <= 1.0)
        img[v_left | v_right] = 0.10
    
    img = np.clip(img, 0.0, 1.0)
    return img

def save_grayscale_as_rgb(arr, filepath):
    arr_uint8 = (np.clip(arr, 0.0, 1.0) * 255).astype(np.uint8)
    pil_img = Image.fromarray(arr_uint8).convert("RGB")
    pil_img = pil_img.filter(ImageFilter.GaussianBlur(radius=0.7))
    pil_img.save(filepath, quality=92)
    print(f"Saved: {filepath}")

# 1. AD MCI Coronal
ad_mci = create_base_mri(256, 256, "coronal")
# Mild hippocampal thinning (temporal horn slight dilation)
cy, cx = 128, 128
y, x = np.ogrid[:256, :256]
horn_left = (((x - (cx - 38)) / 7) ** 2 + ((y - (cy + 22)) / 14) ** 2 <= 1.0)
horn_right = (((x - (cx + 38)) / 6) ** 2 + ((y - (cy + 22)) / 12) ** 2 <= 1.0)
ad_mci[horn_left | horn_right] = 0.12
save_grayscale_as_rgb(ad_mci, os.path.join(OUTPUT_DIR, "ad_mci_coronal.jpg"))

# 2. AD Severe Coronal
ad_severe = create_base_mri(256, 256, "coronal")
horn_left_large = (((x - (cx - 40)) / 14) ** 2 + ((y - (cy + 22)) / 22) ** 2 <= 1.0)
horn_right_large = (((x - (cx + 40)) / 13) ** 2 + ((y - (cy + 22)) / 20) ** 2 <= 1.0)
ad_severe[horn_left_large | horn_right_large] = 0.08
# Sylvian fissure widening
sylvian_l = (((x - (cx - 70)) / 15) ** 2 + ((y - (cy + 10)) / 8) ** 2 <= 1.0)
sylvian_r = (((x - (cx + 70)) / 15) ** 2 + ((y - (cy + 10)) / 8) ** 2 <= 1.0)
ad_severe[sylvian_l | sylvian_r] = 0.10
save_grayscale_as_rgb(ad_severe, os.path.join(OUTPUT_DIR, "ad_severe_coronal.jpg"))

# 3. AD Control Coronal
ad_control = create_base_mri(256, 256, "coronal")
save_grayscale_as_rgb(ad_control, os.path.join(OUTPUT_DIR, "ad_control_coronal.jpg"))

# 4. MS Periventricular Axial (FLAIR: CSF dark, lesions bright)
ms_peri = create_base_mri(256, 256, "axial")
# Demyelinating periventricular plaques (Dawson fingers)
p1 = (((x - (cx - 30)) / 6) ** 2 + ((y - (cy - 12)) / 12) ** 2 <= 1.0)
p2 = (((x - (cx + 28)) / 7) ** 2 + ((y - (cy + 5)) / 10) ** 2 <= 1.0)
p3 = (((x - (cx - 26)) / 8) ** 2 + ((y - (cy + 15)) / 7) ** 2 <= 1.0)
p4 = (((x - (cx + 32)) / 5) ** 2 + ((y - (cy - 25)) / 9) ** 2 <= 1.0)
ms_peri[p1 | p2 | p3 | p4] = 0.95
save_grayscale_as_rgb(ms_peri, os.path.join(OUTPUT_DIR, "ms_periventricular_axial.jpg"))

# 5. MS Juxtacortical Sagittal
ms_juxta = create_base_mri(256, 256, "sagittal")
jp1 = (((x - (cx - 35)) / 8) ** 2 + ((y - (cy - 30)) / 7) ** 2 <= 1.0)
jp2 = (((x - (cx + 20)) / 9) ** 2 + ((y - (cy - 40)) / 8) ** 2 <= 1.0)
jp3 = (((x - cx) / 12) ** 2 + ((y - (cy - 10)) / 6) ** 2 <= 1.0) # Corpus callosum margin
ms_juxta[jp1 | jp2 | jp3] = 0.94
save_grayscale_as_rgb(ms_juxta, os.path.join(OUTPUT_DIR, "ms_juxtacortical_sagittal.jpg"))

# 6. MS Control Axial
ms_control = create_base_mri(256, 256, "axial")
save_grayscale_as_rgb(ms_control, os.path.join(OUTPUT_DIR, "ms_control_axial.jpg"))

# 7. Stroke Acute Axial (DWI b=1000: bright acute ischemia in MCA)
stroke_acute = create_base_mri(256, 256, "axial")
# Left MCA territory wedge-shaped hyperintensity
infarct = (((x - (cx - 45)) / 24) ** 2 + ((y - (cy + 5)) / 30) ** 2 <= 1.0)
stroke_acute[infarct] = 0.98
save_grayscale_as_rgb(stroke_acute, os.path.join(OUTPUT_DIR, "stroke_acute_axial.jpg"))

# 8. Stroke Subacute Axial
stroke_sub = create_base_mri(256, 256, "axial")
infarct_sub = (((x - (cx + 42)) / 20) ** 2 + ((y - (cy - 15)) / 22) ** 2 <= 1.0)
stroke_sub[infarct_sub] = 0.85
save_grayscale_as_rgb(stroke_sub, os.path.join(OUTPUT_DIR, "stroke_subacute_axial.jpg"))

# 9. Stroke Normal Axial
stroke_norm = create_base_mri(256, 256, "axial")
save_grayscale_as_rgb(stroke_norm, os.path.join(OUTPUT_DIR, "stroke_normal_axial.jpg"))

# 10. Future DTI Tractography (RGB Directional Map)
base = create_base_mri(256, 256, "axial")
rgb_dti = np.zeros((256, 256, 3), dtype=np.uint8)
brain_area = base > 0.15
yy, xx = np.mgrid[:256, :256]
rgb_dti[..., 0] = np.clip(base * 180 + np.sin(xx / 10.0) * 40, 0, 255).astype(np.uint8)
rgb_dti[..., 1] = np.clip(base * 150 + np.cos(yy / 12.0) * 45, 0, 255).astype(np.uint8)
rgb_dti[..., 2] = np.clip(base * 210, 0, 255).astype(np.uint8)
rgb_dti[~brain_area] = 0

# Add vibrant tracts
tract_cc = (((xx - cx) / 35.0) ** 2 + ((yy - (cy - 15)) / 8.0) ** 2 <= 1.0)
rgb_dti[tract_cc, 0] = 255
rgb_dti[tract_cc, 1] = 40
rgb_dti[tract_cc, 2] = 50
pil_dti = Image.fromarray(rgb_dti).filter(ImageFilter.GaussianBlur(radius=0.6))
pil_dti.save(os.path.join(OUTPUT_DIR, "future_dti_tractography.jpg"), quality=92)
print("Saved DTI tractography.")

print("All sample scans successfully generated.")
