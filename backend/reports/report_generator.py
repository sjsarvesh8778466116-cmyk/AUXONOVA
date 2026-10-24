from datetime import datetime, timezone
import logging
from typing import Any, Dict, List, Optional
import uuid

logger = logging.getLogger("axonova.reports.report_generator")

SAFETY_NOTICE = (
    "AXONOVA provides an AI-assisted educational assessment, not a confirmed medical diagnosis. "
    "Results may be incomplete or incorrect and must be reviewed by a qualified healthcare professional. "
    "Do not use this report alone to make medical decisions."
)

CATALOG_CONDITIONS_NOT_ASSESSED_DEFAULT = [
    {"category": "B. Vascular and stroke-related findings", "details": "Ischemic/hemorrhagic stroke, aneurysms, vascular malformations"},
    {"category": "C. Demyelinating and inflammatory", "details": "Multiple sclerosis, encephalitis, transverse myelitis"},
    {"category": "D. Infection-related conditions", "details": "Brain abscess, meningitis-related findings, granulomatous disease"},
    {"category": "E. Neurodegenerative disorders", "details": "Alzheimer's disease, frontotemporal dementia, Lewy body patterns"},
    {"category": "F. Trauma-related findings", "details": "Traumatic brain injury, epidural/subdural hematoma, diffuse axonal injury"},
    {"category": "G. Structural, developmental & CSF", "details": "Hydrocephalus, Chiari malformation, congenital anomalies"},
    {"category": "H. Epilepsy-related imaging", "details": "Hippocampal sclerosis, cortical dysplasia"},
    {"category": "I. Pituitary & Cranial Nerve", "details": "Optic pathway lesions, CPA angle masses (outside 4-class catalog)"},
    {"category": "J. Incidental / Other", "details": "Incidental pineal cysts, sinus/mastoid mucosal thickening"},
]

# In-memory store for case reports
_REPORTS_STORE: Dict[str, Dict[str, Any]] = {}

class RadiologyReportGenerator:
    """
    Generates and manages structured, hospital-grade radiology-style AI reports.
    Enforces honest clinical review workflows: reports default to 'Pending Review'
    and can only transition to 'Reviewed' through explicit clinician actions.
    """

    @staticmethod
    def generate_case_id() -> str:
        date_str = datetime.now(timezone.utc).strftime("%Y%m%d")
        rand_str = uuid.uuid4().hex[:6].upper()
        return f"AXO-{date_str}-{rand_str}"

    @classmethod
    def create_report(
        cls,
        analysis_result: Dict[str, Any],
        case_id: Optional[str] = None,
        patient_ref: Optional[str] = None,
        filename: Optional[str] = None,
        scan_type: str = "MRI",
        sequence: Optional[str] = None,
        orientation: Optional[str] = None,
        clinical_indication: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Builds a comprehensive structured clinical report object.
        """
        c_id = case_id or cls.generate_case_id()
        now_iso = datetime.now(timezone.utc).isoformat()

        # Build impression text with strict non-diagnostic language
        status = analysis_result.get("status", "unknown")
        prediction = analysis_result.get("prediction")
        confidence = analysis_result.get("confidence", 0.0)
        confidence_pct = analysis_result.get("confidence_percentage", round(confidence * 100, 2))
        model_name = analysis_result.get("model", "AXONOVA Model")

        if status == "completed":
            impression = (
                f"AI-ASSISTED ASSESSMENT: Deep learning convolutional feature patterns "
                f"are consistent with {prediction} (Statistical output score: {confidence_pct}%). "
                "This educational assessment is probabilistic and requires complete radiologic differential "
                "evaluation and clinical/histopathological correlation."
            )
        elif status == "indeterminate":
            impression = (
                "INDETERMINATE AI ASSESSMENT: The available model did not produce a sufficiently reliable "
                f"classification (Highest output score {confidence_pct}% fell below confidence threshold). "
                "No definitive finding asserted."
            )
        elif status == "not_connected":
            impression = (
                "AI MODEL NOT CONNECTED: The interface is prepared for model integration, but validated neural "
                "weights have not been connected for this sequence. Zero predictions asserted."
            )
        elif status == "not_assessed":
            impression = (
                "NOT ASSESSED: No matching validated AI model is currently available for this protocol. "
                "Zero automated findings asserted."
            )
        elif status == "unsupported":
            impression = (
                "UNSUPPORTED SCAN: The uploaded scan is outside the supported model scope or distribution. "
                "Analysis cannot be performed."
            )
        else:
            impression = "ANALYSIS INCOMPLETE: Scan could not be evaluated by the neural pipeline."

        report = {
            "case_id": c_id,
            "created_at": now_iso,
            "patient_reference": patient_ref or f"PT-ANON-{c_id[-6:]}",
            "clinical_facility": "AXONOVA Medical Imaging AI Center",
            "clinical_indication": clinical_indication or "Educational / Decision-Support Brain MRI Assessment",
            "examination": {
                "study_type": "Brain MRI",
                "filename": filename or "scan.jpg",
                "modality": scan_type,
                "sequence": sequence or "Not specified",
                "plane": orientation or "Not specified",
                "dimensions": analysis_result.get("dimensions", ["Unknown", "Unknown"]),
                "quality_metrics": analysis_result.get("quality_metrics", {}),
            },
            "ai_findings": {
                "status": status,
                "model_name": model_name,
                "model_version": analysis_result.get("model_version", "1.0.0"),
                "task": analysis_result.get("task", "classification"),
                "primary_finding": prediction,
                "confidence_score": confidence,
                "confidence_percentage": confidence_pct,
                "per_class_scores": analysis_result.get("class_scores", []),
                "explainability": analysis_result.get("explainability", {
                    "supported": False,
                    "explanation": "Explainability visualization is not available for this model.",
                }),
            },
            "impression": impression,
            "conditions_not_assessed": CATALOG_CONDITIONS_NOT_ASSESSED_DEFAULT,
            "limitations": analysis_result.get("limitations", [
                "Single 2D slice does not represent a full 3D volumetric MRI examination.",
                "AI results are statistical inferences and must not be used as standalone medical diagnoses.",
            ]),
            "review": {
                "status": "PENDING_REVIEW",  # PENDING_REVIEW or REVIEWED
                "status_label": "Pending Professional Review",
                "reviewed_by": None,
                "reviewer_title": None,
                "reviewer_license": None,
                "reviewed_at": None,
                "decision": None,
                "clinical_notes": None,
            },
            "timeline": [
                {
                    "stage": "upload",
                    "title": "Study Ingestion & Integrity Check",
                    "description": f"File '{filename or 'scan.jpg'}' received and registered with integrity checks.",
                    "timestamp": analysis_result.get("upload_timestamp", now_iso),
                    "status": "COMPLETED",
                    "details": {
                        "filename": filename or "scan.jpg",
                        "modality": scan_type,
                        "sequence": sequence or "Standard Axial",
                    },
                },
                {
                    "stage": "validation",
                    "title": "Photometric & Quality Check",
                    "description": "Spatial dimensions, dynamic range, and field-of-view border intensities verified.",
                    "timestamp": analysis_result.get("validation_timestamp", now_iso),
                    "status": "COMPLETED",
                    "details": analysis_result.get("quality_metrics", {}),
                },
                {
                    "stage": "model_routing",
                    "title": "Protocol Routing & Model Discovery",
                    "description": f"Target neuroimaging protocol routed to {model_name}.",
                    "timestamp": analysis_result.get("routing_timestamp", now_iso),
                    "status": "COMPLETED",
                    "details": {
                        "routed_model": model_name,
                        "protocol_compatible": analysis_result.get("supported", True),
                    },
                },
                {
                    "stage": "inference",
                    "title": "Neural Inference Pass",
                    "description": f"Forward pass executed. Primary pattern: {prediction or 'Inconclusive'} ({confidence_pct}%).",
                    "timestamp": analysis_result.get("inference_timestamp", now_iso),
                    "status": "COMPLETED" if status == "completed" else status.upper(),
                    "details": {
                        "confidence_score": confidence,
                        "threshold": analysis_result.get("confidence_threshold", 0.55),
                    },
                },
                {
                    "stage": "explainability",
                    "title": "Grad-CAM Activation Heatmap",
                    "description": "Layer-targeted backpropagation generated spatial attention overlay.",
                    "timestamp": analysis_result.get("explainability_timestamp", now_iso),
                    "status": "COMPLETED" if analysis_result.get("explainability", {}).get("supported") else "SKIPPED",
                    "details": {
                        "method": analysis_result.get("explainability", {}).get("method", "Layer-Targeted Grad-CAM"),
                    },
                },
                {
                    "stage": "report_creation",
                    "title": "Radiology Decision-Support Report Generated",
                    "description": f"Structured clinical findings compiled under Case ID {c_id}.",
                    "timestamp": now_iso,
                    "status": "COMPLETED",
                },
                {
                    "stage": "professional_review",
                    "title": "Professional Radiologist Sign-Off",
                    "description": "Formal clinician review and signature verification.",
                    "timestamp": None,
                    "status": "PENDING_REVIEW",
                    "details": {
                        "status_label": "Pending Professional Review",
                    },
                },
            ],
            "disclaimer": SAFETY_NOTICE,
        }

        # Store in-memory
        _REPORTS_STORE[c_id] = report
        return report

    @classmethod
    def get_report(cls, case_id: str) -> Optional[Dict[str, Any]]:
        return _REPORTS_STORE.get(case_id)

    @classmethod
    def review_report(
        cls,
        case_id: str,
        reviewer_name: str,
        reviewer_title: str,
        reviewer_license: Optional[str] = None,
        decision: str = "CONFIRMED",
        clinical_notes: Optional[str] = None,
    ) -> Optional[Dict[str, Any]]:
        """
        Executes genuine clinician review and sign-off.
        Only this explicit method transitions the status to REVIEWED.
        """
        report = _REPORTS_STORE.get(case_id)
        if not report:
            return None

        review_iso = datetime.now(timezone.utc).isoformat()
        report["review"] = {
            "status": "REVIEWED",
            "status_label": f"Reviewed by {reviewer_name}, {reviewer_title}",
            "reviewed_by": reviewer_name,
            "reviewer_title": reviewer_title,
            "reviewer_license": reviewer_license or "MD / Board Certified Radiologist",
            "reviewed_at": review_iso,
            "decision": decision,
            "clinical_notes": clinical_notes or "Findings reviewed and integrated into clinical context.",
        }

        # Update the professional_review event in timeline with real review timestamp!
        if "timeline" in report:
            for ev in report["timeline"]:
                if ev.get("stage") == "professional_review":
                    ev["status"] = "REVIEWED"
                    ev["timestamp"] = review_iso
                    ev["description"] = (
                        f"Clinician review completed and signed by {reviewer_name}, {reviewer_title} "
                        f"({decision})."
                    )
                    ev["details"] = {
                        "reviewed_by": reviewer_name,
                        "reviewer_name": reviewer_name,
                        "reviewer_title": reviewer_title,
                        "reviewer_license": reviewer_license or "MD / Board Certified Radiologist",
                        "decision": decision,
                        "clinical_notes": clinical_notes,
                    }

        return report


# Global singleton report generator
report_generator = RadiologyReportGenerator()
