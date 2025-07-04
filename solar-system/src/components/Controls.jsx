import React from 'react'

const Controls = ({ planets, onSpeedChange }) => {
  return (
    <div className="absolute top-4 right-1 bg-gray-800 bg-opacity-80 p-3 rounded-lg text-white"
         style={{
           minWidth: 250,
           maxHeight: 700, // Large enough for all sliders
           overflowY: "visible", // No scroll
         }}>
      <h2 className="text-lg font-semibold mb-4">Orbital Speed Controls</h2>
      {planets.map((planet, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-1">
            {planet.name} Speed: {planet.speed.toFixed(3)}
          </label>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.001"
            value={planet.speed}
            onChange={(e) => onSpeedChange(planet.name, parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default Controls;