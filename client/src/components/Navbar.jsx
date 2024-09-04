import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to={isAuthenticated ? "/tasks" : "/"}>
        <h1 className="text-2xl font-bold">Tasks Manager</h1>
      </Link>
      <ul className="flex gap-x-2">
        {isAuthenticated ? (
          <>
            <li>Welcome <h3 className="font-bold">{user.username}</h3></li>
            <li>
              <Link
                className="bg-indigo-500 px-4 py-1 rounded-md"
                to="/add-task"
              >
                New Task
              </Link>
            </li>
            <li>
              <Link className="bg-indigo-500 px-4 py-1 rounded-md" to="/tasks">
                Tasks
              </Link>
            </li>
            <li>
              <Link className="bg-indigo-500 px-4 py-1 rounded-md" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/"
                onClick={() => {
                  logout();
                }}
              >
                Log Out
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link className="bg-indigo-500 px-4 py-1 rounded-md" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link
                className="bg-indigo-500 px-4 py-1 rounded-md"
                to="/register"
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
