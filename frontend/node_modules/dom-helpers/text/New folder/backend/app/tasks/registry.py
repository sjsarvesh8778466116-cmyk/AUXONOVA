from typing import Dict, List, Optional
from fastapi import HTTPException, status

from app.tasks.base import BaseMriTask
from app.tasks.brain_tumor import BrainTumorTask
from app.tasks.alzheimers import AlzheimersTask
from app.tasks.multiple_sclerosis import MultipleSclerosisTask
from app.tasks.stroke import StrokeTask
from app.tasks.future_research import FutureResearchTask

class TaskRegistry:
    """
    Central registry for all MRI research condition tasks in AXONOVA.
    Guarantees strict isolation of datasets, preprocessing, model files, and metrics.
    """

    def __init__(self):
        self._tasks: Dict[str, BaseMriTask] = {
            "brain-tumor": BrainTumorTask(),
            "alzheimers": AlzheimersTask(),
            "multiple-sclerosis": MultipleSclerosisTask(),
            "stroke": StrokeTask(),
            "future-research": FutureResearchTask(),
        }

    def get_task(self, task_id: str) -> Optional[BaseMriTask]:
        return self._tasks.get(task_id)

    def get_task_or_404(self, task_id: str) -> BaseMriTask:
        task = self._tasks.get(task_id)
        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task '{task_id}' not found. Available tasks: {list(self._tasks.keys())}",
            )
        return task

    def get_all_tasks(self) -> List[BaseMriTask]:
        return list(self._tasks.values())

    def get_ready_tasks(self) -> List[BaseMriTask]:
        return [t for t in self._tasks.values() if t.is_ready()]

# Global registry instance
task_registry = TaskRegistry()
