import { GeneralFeed } from "../components/generalFeed";
import { PostInput } from "../components/postInput";
import { UserFeed } from "../components/userFeed";

export const Main = () => {
  return (
    <>
      <h1>Main Page</h1>
      <div className="border h-full w-full flex flex-col justify-between">
        <PostInput />
        <div className="">
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
