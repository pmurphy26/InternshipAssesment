import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./Task";
import { useDroppable } from "@dnd-kit/core";
import "./Column.css";

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
}

export function Column({ id, title, tasks, onSelectTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`column-container ${isOver ? "column-over" : ""}`}
    >
      <div className="column-header">
        <h2 className="column-title">{title}</h2>
        <span className="column-count">{tasks.length}</span>
      </div>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            selectTask={(task: Task) => {
              console.log("selected task");
              onSelectTask(task);
            }}
          />
        ))}
      </div>
    </div>
  );
}
