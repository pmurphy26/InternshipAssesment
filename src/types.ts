export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "low" | "normal" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  user_id: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  assignee_id?: string;
  created_at: string;
}
