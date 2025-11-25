import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar({ theme, setTheme }) {
  const location = useLocation();
  const showBack = location.pathname !== "/";

  return (
    <header className="bg-transparent">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">

          {/* BACK BUTTON */}
          {showBack && (
            <Link
              to="/"
              className="mr-2 flex items-center gap-1 px-3 py-1.5 rounded bg-white/70 dark:bg-gray-800/60 shadow-sm backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition"
            >
              <span className="text-lg">←</span>
              <span className="text-sm font-medium">Back</span>
            </Link>
          )}

          {/* APP NAME */}
          <img
            src={logo}
            alt="SevaMitra logo"
            className="h-20 w-35 inline-block align-middle object-contain bg-transparent rounded-2xl"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm shadow-sm hover:bg-white dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}
