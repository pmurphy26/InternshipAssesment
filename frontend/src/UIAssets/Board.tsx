import { useEffect, useMemo, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { fetchTasks, updateTaskStatus } from "../helpers/apiCalls";
import type { Task, TaskStatus } from "@shared/types";
import { Column } from "./Column";
import { COLUMNS } from "../helpers/constants";
import "./Board.css";
import { useTasksRealtime } from "../helpers/useTaskRealTime";

export function KanbanBoard({
  setSelectedTask,
  setDisplayTypeNone,
}: {
  setSelectedTask: (t: Task) => void;
  setDisplayTypeNone: () => void;
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchTasks();
        setTasks(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useTasksRealtime(({ new: newTask, old: oldTask, eventType }) => {
    setTasks((prev) => {
      if (eventType === "INSERT") {
        return [...prev, newTask];
      }
      if (eventType === "UPDATE") {
        return prev.map((t) => (t.id === newTask.id ? newTask : t));
      }
      if (eventType === "DELETE") {
        return prev.filter((t) => t.id !== oldTask?.id);
      }
      return prev;
    });
  });

  const tasksByStatus = useMemo(
    () =>
      COLUMNS.reduce(
        (acc, col) => ({
          ...acc,
          [col.id]: tasks.filter((t) => t.status === col.id),
        }),
        {} as Record<TaskStatus, Task[]>,
      ),
    [tasks],
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const targetStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t)),
    );

    try {
      await updateTaskStatus(taskId, targetStatus);
      setDisplayTypeNone();
    } catch (e) {
      console.error(e);

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: task.status } : t)),
      );
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading tasks…</div>;

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="board-grid">
        {COLUMNS.map((col) => {
          const columnTasks = tasksByStatus[col.id];

          return (
            <div
              key={col.id}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                boxSizing: "border-box",
              }}
            >
              <SortableContext
                key={col.id}
                items={columnTasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                <Column
                  id={col.id}
                  title={col.title}
                  tasks={columnTasks}
                  onSelectTask={(t: Task) => {
                    setSelectedTask(t);
                  }}
                />
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}
