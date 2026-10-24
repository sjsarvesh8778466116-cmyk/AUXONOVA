import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from reports.report_generator import report_generator

logger = logging.getLogger("axonova.api.reports")

router = APIRouter(prefix="/api/report", tags=["Radiology Reports & Clinician Review"])

class ClinicianReviewRequest(BaseModel):
    reviewer_name: str = Field(..., min_length=2, description="Full name of reviewing clinician")
    reviewer_title: str = Field("MD, Radiologist", description="Professional title or specialty")
    reviewer_license: Optional[str] = Field("Board Certified Radiologist", description="Medical license number or certification")
    decision: str = Field("CONFIRMED", description="Clinical decision: CONFIRMED, DISAGREE, or MODIFIED")
    clinical_notes: Optional[str] = Field(None, description="Radiologist diagnostic remarks and notes")


@router.get("/{case_id}")
async def get_report_by_case_id(case_id: str):
    """Retrieves full structured radiology-style report for a case."""
    report = report_generator.get_report(case_id)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report for Case ID '{case_id}' was not found.",
        )
    return report


@router.post("/{case_id}/review")
async def review_and_sign_report(case_id: str, review_data: ClinicianReviewRequest):
    """
    Executes professional review sign-off.
    Transitions report status from 'Pending Professional Review' to 'REVIEWED'.
    Requires explicit clinician identity and credentials.
    """
    updated_report = report_generator.review_report(
        case_id=case_id,
        reviewer_name=review_data.reviewer_name,
        reviewer_title=review_data.reviewer_title,
        reviewer_license=review_data.reviewer_license,
        decision=review_data.decision,
        clinical_notes=review_data.clinical_notes,
    )

    if not updated_report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report for Case ID '{case_id}' not found for review.",
        )

    logger.info("Report %s successfully reviewed and signed by %s.", case_id, review_data.reviewer_name)
    return {
        "status": "success",
        "case_id": case_id,
        "review_status": "REVIEWED",
        "reviewed_by": review_data.reviewer_name,
        "report": updated_report,
    }
