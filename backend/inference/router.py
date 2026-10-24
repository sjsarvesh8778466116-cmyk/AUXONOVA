import logging
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger("axonova.inference.router")

class RouterDecision:
    def __init__(
        self,
        can_run: bool,
        status: str,
        selected_model: Optional[Any] = None,
        reason: Optional[str] = None,
        compatible_models: Optional[List[str]] = None,
    ):
        self.can_run = can_run
        self.status = status  # "READY", "NOT_ASSESSED", "NOT_CONNECTED", "UNSUPPORTED_SEQUENCE"
        self.selected_model = selected_model
        self.reason = reason
        self.compatible_models = compatible_models or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "can_run": self.can_run,
            "status": self.status,
            "selected_model": self.selected_model.name if self.selected_model else None,
            "selected_model_id": self.selected_model.model_id if self.selected_model else None,
            "reason": self.reason,
            "compatible_models": self.compatible_models,
        }


class ModelRouter:
    """
    Intelligent Model Router that maps uploaded scan characteristics (sequence, condition)
    to verified AI models. Never forces an incompatible image into an unrelated model.
    """

    def __init__(self, registry=None):
        self._registry = registry

    @property
    def registry(self):
        if self._registry is None:
            from models.registry import central_registry
            self._registry = central_registry
        return self._registry

    def route_scan(
        self,
        scan_type: str = "MRI",
        sequence: Optional[str] = None,
        target_condition: Optional[str] = None,
        requested_model_id: Optional[str] = None,
    ) -> RouterDecision:
        """
        Determines the appropriate model for the uploaded scan.
        """
        # If explicit model requested by ID
        if requested_model_id:
            model = self.registry.get_model_by_id(requested_model_id)
            if not model:
                return RouterDecision(
                    can_run=False,
                    status="NOT_ASSESSED",
                    reason=f"Requested model ID '{requested_model_id}' was not found in the registry.",
                )
            if not model.is_available():
                return RouterDecision(
                    can_run=False,
                    status="NOT_CONNECTED",
                    selected_model=model,
                    reason=(
                        "Model not currently available. This condition is under development."
                    ),
                )
            return RouterDecision(
                can_run=True,
                status="READY",
                selected_model=model,
                compatible_models=[model.name],
            )

        # Automatic sequence/condition routing
        compatible = self.registry.find_compatible_models(
            sequence=sequence,
            target_condition=target_condition,
        )

        if not compatible:
            return RouterDecision(
                can_run=False,
                status="NOT_ASSESSED",
                reason=(
                    "Model not currently available. This condition is under development."
                ),
                compatible_models=[],
            )

        # Check if any compatible model has active weights
        available_models = [m for m in compatible if m.is_available()]
        compatible_names = [m.name for m in compatible]

        if not available_models:
            first_candidate = compatible[0]
            return RouterDecision(
                can_run=False,
                status="NOT_CONNECTED",
                selected_model=first_candidate,
                reason=(
                    "Model not currently available. This condition is under development."
                ),
                compatible_models=compatible_names,
            )


        # Select primary active model
        selected = available_models[0]
        return RouterDecision(
            can_run=True,
            status="READY",
            selected_model=selected,
            compatible_models=compatible_names,
        )


# Global singleton router
model_router = ModelRouter()
