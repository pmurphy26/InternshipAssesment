import type { Task, TaskStatus } from "@shared/types";

export const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "in_review", title: "In Review" },
  { id: "done", title: "Done" },
];

export const mockTasks: Task[] = [
  {
    id: "0",
    title: "Test task",
    status: "todo",
    user_id: "userid123456789",
    created_at: "4-15-2026",
  } as Task,
  {
    id: "1",
    title: "Test task 1",
    status: "todo",
    user_id: "userid123456789",
    created_at: "4-15-2026",
    description: "test",
    priority: "low",
    due_date: "4-20-2026",
  },
];

export function padNumberWithZeros(num: number, targetLength: number): string {
  return String(num).padStart(targetLength, "0");
}
