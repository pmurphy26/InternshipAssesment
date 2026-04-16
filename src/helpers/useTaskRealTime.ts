import { useEffect } from "react";
import { supabase } from "./supabaseClient";
import type { Task } from "../types";

export function useTasksRealtime(
  onChange: (payload: {
    new: Task;
    old: Task | null;
    eventType: "INSERT" | "UPDATE" | "DELETE";
  }) => void,
) {
  useEffect(() => {
    const channel = supabase
      .channel("tasks-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tasks" },
        (payload) => {
          onChange({
            new: payload.new as Task,
            old: payload.old as Task | null,
            eventType: payload.eventType as "INSERT" | "UPDATE" | "DELETE",
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onChange]);
}
