import { useState } from "react";
import { AddTask } from "../components/addTask";
import { Display } from "../components/display";

import { Todo } from "../types";

export const Dashboard = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  return (
    <>
      <div>
        <Display
          todos={todos}
          setTodos={setTodos}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <AddTask
          task={task}
          setTask={setTask}
          todos={todos}
          setTodos={setTodos}
        />
      </div>
    </>
  );
};
