import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

function Navbar() {
  useEffect(() => {
    let menu = document.querySelector("#menu-icon");
    let navlist = document.querySelector(".nav-res");
    menu.onclick = () => {
      menu.classList.toggle("bx-x");
      navlist.classList.toggle("active");
    };
  }, []);

  const { isAuthenticated, logout, user } = useAuth();
  return (
    <nav className="bg-zinc-700 my-3 flex justify-between py-5 px-10 rounded-lg">
      <Link to={isAuthenticated ? "/tasks" : "/"}>
        <h1 className="text-2xl font-bold">Tasks Manager</h1>
      </Link>
      <div className="bx bx-menu" id="menu-icon"></div>
      <ul className="flex gap-x-2 nav-res">
        {isAuthenticated ? (
          <>
            <li>
              <h3 className="font-bold username1">{user.username}</h3>
            </li>
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
