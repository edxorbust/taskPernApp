import { useTasks } from "../context/TasksContext";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  return (
    <div className="bg-zinc-800 max-w-md w-full p-10 rounded-md">
      <header className="flex justify-between card-res">
        <h1 className="text-2xl font-bold word-res">{task.title}</h1>
        <div className="flex gap-x-2 items-center btn-task-res">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={() => {
              deleteTask(task.id);
            }}
          >
            delete
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
            <Link to={`/tasks/${task.id}`}>edit</Link>
          </button>
        </div>
      </header>
      <p className="text-slate-300">{task.description}</p>
      <p>{dayjs(task.date).utc().format("DD-MM-YYYY")}</p>
    </div>
  );
}

export default TaskCard;
