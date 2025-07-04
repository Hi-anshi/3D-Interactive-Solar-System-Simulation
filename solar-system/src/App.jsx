import { useState } from "react";
import SolarSystem from "./components/SolarSystem";

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen m-0 p-0 ${
        darkMode ? "bg-black" : "bg-white"
      }`}
      style={{ overflow: "hidden" }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white px-4 py-2 rounded-lg z-10"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <SolarSystem isDarkMode={darkMode} />
    </div>
  );
};

export default App;