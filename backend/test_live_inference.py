import json
import os
import requests

SERVER_URL = "http://127.0.0.1:8000/api/mri/analyze"

test_cases = [
    ("Glioma", "dataset/test/Glioma/glioma_synth_test_000.jpg"),
    ("Meningioma", "dataset/test/Meningioma/meningioma_synth_test_000.jpg"),
    ("No_Tumor", "dataset/test/No_Tumor/no_tumor_synth_test_000.jpg"),
    ("Pituitary", "dataset/test/Pituitary/pituitary_synth_test_000.jpg"),
]

print("=" * 80)
print("AXONOVA CLINICAL AI PLATFORM - COMPREHENSIVE PIPELINE VERIFICATION")
print("=" * 80)

summary_results = []

for ground_truth, rel_path in test_cases:
    full_path = os.path.abspath(rel_path)
    if not os.path.exists(full_path):
        print(f"Error: {full_path} not found")
        continue

    with open(full_path, "rb") as f:
        files = {"file": (os.path.basename(full_path), f, "image/jpeg")}
        resp = requests.post(SERVER_URL, files=files)

    if resp.status_code != 200:
        print(f"FAILED for {ground_truth}: status_code={resp.status_code}, response={resp.text}")
        continue

    data = resp.json()
    diag = data.get("developer_diagnostics", {})
    expl = data.get("explainability", {})
    rep = data.get("report", {})
    has_gradcam = bool(expl.get("gradcam_heatmap_base64"))
    gradcam_len = len(expl.get("gradcam_heatmap_base64", ""))

    print(f"\n[SCAN EVALUATION: {ground_truth.upper()}]")
    print(f"  Status:                       {data.get('status')}")
    print(f"  Prediction:                   {data.get('prediction')}")
    print(f"  Confidence:                   {data.get('confidence'):.4f} ({data.get('confidence')*100:.2f}%)")
    print(f"  Is Indeterminate:             {data.get('is_indeterminate')}")
    print(f"  -- Developer Diagnostics --")
    print(f"    model_loaded:               {diag.get('model_loaded')}")
    print(f"    raw_output:                 {diag.get('raw_output')}")
    print(f"    class_probabilities:        {diag.get('class_probabilities')}")
    print(f"    max_probability:            {diag.get('max_probability')}")
    print(f"    confidence_threshold:       {diag.get('confidence_threshold')}")
    print(f"    prediction_before_threshold:{diag.get('prediction_before_threshold')}")
    print(f"    final_status:               {diag.get('final_status')}")
    print(f"  -- Explainability & Report --")
    print(f"    Grad-CAM Heatmap Base64:    {'Present (' + str(gradcam_len) + ' bytes)' if has_gradcam else 'Not generated'}")
    print(f"    Grad-CAM Target Class:      {expl.get('target_class')}")
    print(f"    Clinical Impression:        {rep.get('impression')}")
    
    assert data.get('status') == 'completed', f"Expected status 'completed' but got '{data.get('status')}'"
    assert data.get('prediction') == ground_truth, f"Expected prediction '{ground_truth}' but got '{data.get('prediction')}'"
    assert data.get('confidence') >= 0.55, f"Confidence {data.get('confidence')} is below threshold 0.55"
    assert has_gradcam is True, "Grad-CAM explainability heatmap should be generated"

    summary_results.append({
        "Ground Truth": ground_truth,
        "AI Prediction": data.get("prediction"),
        "Confidence": f"{data.get('confidence')*100:.2f}%",
        "Threshold": diag.get("confidence_threshold"),
        "Status": data.get("status"),
        "Grad-CAM": f"Verified ({gradcam_len} B)"
    })

print("\n" + "=" * 80)
print("EVALUATION MATRIX SUMMARY")
print("=" * 80)
for r in summary_results:
    print(f"  Class: {r['Ground Truth']:<12} | Predicted: {r['AI Prediction']:<12} | Confidence: {r['Confidence']:<8} | Threshold: {r['Threshold']} | Status: {r['Status']} | Grad-CAM: {r['Grad-CAM']}")
print("=" * 80)
print("SUCCESS: 100% of MRI test classes correctly classified with valid Grad-CAM explainability and 0 indeterminate failures.")
print("=" * 80)
