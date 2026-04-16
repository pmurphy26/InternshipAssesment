import { supabase } from "./supabaseClient";
import type { Task, TaskStatus } from "@shared/types";

export async function fetchTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;
  //return mockTasks;
  return data as Task[];
}

export async function createTask(input: Task) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user");

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: input.title,
      status: input.status,
      description: input?.description ?? null,
      priority: input?.priority ?? "normal",
      due_date: input?.due_date ?? null,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTask(input: Task) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("No user");

  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: input.title,
      status: input.status,
      description: input.description ?? null,
      priority: input.priority ?? "normal",
      due_date: input.due_date ?? null,
    })
    .eq("id", input.id)
    .eq("user_id", user.id) // extra safety with RLS
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const { data, error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}
