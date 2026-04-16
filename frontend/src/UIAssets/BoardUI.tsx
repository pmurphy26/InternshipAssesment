import { useState } from "react";
import { KanbanBoard } from "./Board";
import { CreateTask, EditTask, TaskUI } from "./Task";
import "./BoardUI.css";
import { BoardHeader } from "./BoardHeader";
import type { Task } from "@shared/types";
import { createTask, updateTask } from "../helpers/apiCalls";

export function BoardUI() {
  const [rightSideDisplayType, setRightSideDisplayType] = useState<
    "NONE" | "TASK" | "CREATE" | "EDIT"
  >("NONE");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <div className="board-container">
      <BoardHeader
        createNewEvent={() => {
          console.log("new display type");
          setRightSideDisplayType("CREATE");
        }}
      />
      <div className="board-split">
        <div className="left-split">
          <KanbanBoard
            setSelectedTask={(t) => {
              setSelectedTask(t);
              setRightSideDisplayType("TASK");
            }}
            setDisplayTypeNone={() => {
              setRightSideDisplayType("NONE");
            }}
          />
        </div>
        <div className="right-split">
          {/*<!-- Scrollable sidebar -->*/}
          <div className="right-split-inner">
            {rightSideDisplayType == "TASK" && selectedTask && (
              <TaskUI
                task={selectedTask}
                openEvent={function (): void {
                  setRightSideDisplayType("NONE");
                }}
                editEvent={function (): void {
                  setRightSideDisplayType("EDIT");
                }}
              />
            )}
            {/* Create new task */}
            {rightSideDisplayType == "CREATE" && (
              <CreateTask
                createEvent={async (t: Task) => {
                  try {
                    await createTask(t);
                    console.log("created new task");
                    setRightSideDisplayType("NONE");
                  } catch (e) {
                    console.log("error creating task");
                  }
                }}
                openEvent={() => {
                  setRightSideDisplayType("TASK");
                }}
              />
            )}
            {/* Edit Task */}
            {rightSideDisplayType == "EDIT" && selectedTask && (
              <EditTask
                initialTask={selectedTask}
                saveEvent={async (t: Task) => {
                  try {
                    await updateTask(t);
                    console.log("updated new task");
                    setRightSideDisplayType("NONE");
                  } catch (e) {
                    console.log("error updating task");
                  }
                }}
                openEvent={() => {
                  setRightSideDisplayType("TASK");
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
