import { GeneralFeed } from "../components/generalFeed";
import { PostInput } from "../components/postInput";
import { UserFeed } from "../components/userFeed";

export const Main = () => {
  return (
    <>
      <div className="border flex flex-col h-h-full justify-between">
        <PostInput />
        <div className="h-full">
          <GeneralFeed />
          <UserFeed />
        </div>
      </div>
    </>
  );
};

// export const Main = () => {
//   const [task, setTask] = useState("");
//   const [todos, setTodos] = useState<Todo[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   return (
//     <>
//       <div>
//         <Display
//           todos={todos}
//           setTodos={setTodos}
//           isLoading={isLoading}
//           setIsLoading={setIsLoading}
//         />
//         <AddTask
//           task={task}
//           setTask={setTask}
//           todos={todos}
//           setTodos={setTodos}
//         />
//       </div>
//     </>
//   );
// };
