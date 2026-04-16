import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskPriority, TaskStatus } from "../types";
import "./Task.css";
import { NumberForm, TextForm } from "../helpers/forms";

const priorityColors: Record<string, string> = {
  low: "#A7C957",
  normal: "#F9C74F",
  high: "#BC4749",
};

export function TaskCard({
  task,
  selectTask,
}: {
  task: Task;
  selectTask: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityClass = priorityColors[task?.priority ?? "normal"];

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, borderTop: `16px solid ${priorityClass}` }}
      {...attributes}
      {...listeners}
      className={`task-card ${isDragging ? ":active" : ""}`}
      onContextMenu={(e) => {
        e.preventDefault();
        selectTask(task);
      }}
    >
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
      </div>
      {task.due_date && (
        <p className="task-due-date">
          {new Date(task.due_date).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

export function CreateTask({
  createEvent,
  openEvent,
}: {
  createEvent: (t: Task) => void;
  openEvent: () => void;
}) {
  const [newTask, setNewTask] = useState<Task>({
    id: "-1",
    title: "New Event",
    status: "todo" as TaskStatus,
    user_id: "-1",
    description: "",
    priority: "low",
    due_date: "04-15-2026",
    created_at: new Date().toISOString().split("T")[0],
  } as Task);

  return (
    <div className="task-event">
      {/*Header at top*/}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            borderRadius: "0px",
            background: "white",
            border: "none",
          }}
        >
          X
        </button>

        <button
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            padding: "6px 8px",
            background: "#f4e285",
          }}
          onClick={() => {
            createEvent(newTask);
          }}
        >
          Create
        </button>
      </div>
      <div className="task-event-attributes">
        <TextForm
          title={"Title"}
          textValue={newTask.title}
          onSetVal={function (s: string): void {
            setNewTask({ ...newTask, title: s });
          }}
        />
      </div>
      <div className="task-event-attributes">
        <label>
          Priority:
          <select
            value={newTask.priority}
            onChange={(e) => {
              setNewTask({
                ...newTask,
                priority: e.target.value as TaskPriority,
              });
            }}
          >
            {["low", "normal", "high"].map((m) => (
              <option key={`fm-${m}`} value={m}>
                {m}
              </option>
            ))}{" "}
          </select>
        </label>
      </div>

      <div className="task-event-attributes">
        <TextForm
          title={"Description"}
          textValue={newTask?.description ?? ""}
          onSetVal={function (s: string): void {
            setNewTask({ ...newTask, description: s });
          }}
        />
      </div>
      <div className="task-event-attributes">
        <label>
          Status:
          <select
            value={newTask.status}
            onChange={(e) => {
              setNewTask({
                ...newTask,
                status: e.target.value as TaskStatus,
              });
            }}
          >
            {["todo", "in_progress", "in_review", "done"].map((m, i) => (
              <option key={`fm-${m}`} value={i}>
                {m}
              </option>
            ))}{" "}
          </select>
        </label>
      </div>
      <div className="task-event-title">
        <NumberForm
          title={"Due Date:"}
          numberValue={Number(newTask.due_date?.split("-")[0]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${n}-${newTask.due_date?.split("-")[1]}-${newTask.due_date?.split("-")[2]}`,
            });
          }}
        />
        <NumberForm
          title={"-"}
          numberValue={Number(newTask.due_date?.split("-")[1]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${newTask.due_date?.split("-")[0]}-${n}-${newTask.due_date?.split("-")[2]}`,
            });
          }}
        />
        <NumberForm
          title={"-"}
          numberValue={Number(newTask.due_date?.split("-")[2]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${newTask.due_date?.split("-")[0]}-${newTask.due_date?.split("-")[1]}-${n}`,
            });
          }}
        />
      </div>
    </div>
  );
}

export function EditTask({
  initialTask,
  saveEvent,
  openEvent,
}: {
  initialTask: Task;
  saveEvent: (t: Task) => void;
  openEvent: () => void;
}) {
  const [newTask, setNewTask] = useState<Task>({ ...initialTask });

  return (
    <div className="task-event">
      {/*Header at top*/}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            borderRadius: "0px",
            background: "white",
            border: "none",
          }}
        >
          X
        </button>

        <button
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "center",
            padding: "6px 8px",
            background: "#f4e285",
          }}
          onClick={() => {
            saveEvent(newTask);
          }}
        >
          Save
        </button>
      </div>
      <div className="task-event-attributes">
        <TextForm
          title={"Title"}
          textValue={newTask.title}
          onSetVal={function (s: string): void {
            setNewTask({ ...newTask, title: s });
          }}
        />
      </div>
      <div className="task-event-attributes">
        <label>
          Priority:
          <select
            value={newTask.priority}
            onChange={(e) => {
              setNewTask({
                ...newTask,
                priority: e.target.value as TaskPriority,
              });
            }}
          >
            {["low", "normal", "high"].map((m) => (
              <option key={`fm-${m}`} value={m}>
                {m}
              </option>
            ))}{" "}
          </select>
        </label>
      </div>
      <div className="task-event-attributes">
        <TextForm
          title={"Description"}
          textValue={newTask?.description ?? ""}
          onSetVal={function (s: string): void {
            setNewTask({ ...newTask, description: s });
          }}
        />
      </div>
      <div className="task-event-attributes">
        <label>
          Status:
          <select
            value={newTask.status}
            onChange={(e) => {
              setNewTask({
                ...newTask,
                status: e.target.value as TaskStatus,
              });
            }}
          >
            {["todo", "in_progress", "in_review", "done"].map((m, i) => (
              <option key={`fm-${m}`} value={i}>
                {m}
              </option>
            ))}{" "}
          </select>
        </label>
      </div>
      <div className="task-event-title">
        <NumberForm
          title={"Due Date:"}
          numberValue={Number(newTask.due_date?.split("-")[0]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${n}-${newTask.due_date?.split("-")[1]}-${newTask.due_date?.split("-")[2]}`,
            });
          }}
        />
        <NumberForm
          title={"-"}
          numberValue={Number(newTask.due_date?.split("-")[1]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${newTask.due_date?.split("-")[0]}-${n}-${newTask.due_date?.split("-")[2]}`,
            });
          }}
        />
        <NumberForm
          title={"-"}
          numberValue={Number(newTask.due_date?.split("-")[2]) ?? 0}
          onSetVal={(n: number) => {
            setNewTask({
              ...newTask,
              due_date: `${newTask.due_date?.split("-")[0]}-${newTask.due_date?.split("-")[1]}-${n}`,
            });
          }}
        />
      </div>
    </div>
  );
}

interface TaskProps {
  task: Task;
  openEvent: () => void;
  editEvent: () => void;
}

export function TaskUI({ task, openEvent, editEvent }: TaskProps) {
  return (
    <div className="task-event">
      <div
        style={{
          padding: "4px 4px",
          background: "#386641",
        }}
        className="task-event-title"
      >
        <button
          onClick={openEvent}
          style={{
            height: "100%",
            cursor: "pointer",
            background: "white",
            border: "none",
          }}
        >
          ←
        </button>
        {/* Edit button */}
        <button
          style={{
            background: "white",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={editEvent}
        >
          <picture>
            <img src={`/pencil_img.png`} alt="Edit " width="40" height="40" />
          </picture>
        </button>
      </div>
      <div
        className="task-event-attributes"
        style={{ borderBottom: "2px solid black" }}
      >{`${task.title}`}</div>

      {task.description && task.description != "" && (
        <div className="task-event-attributes">{`Description: ${task.description}`}</div>
      )}
      <div className="task-event-attributes">{`Due Date: ${task.due_date}`}</div>
      <div className="task-event-attributes">{`Status: ${task.status}`}</div>
      <div className="task-event-attributes">{`Priority: ${task.priority}`}</div>
    </div>
  );
}
