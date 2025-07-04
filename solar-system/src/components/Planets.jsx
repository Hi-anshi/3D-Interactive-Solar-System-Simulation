import * as THREE from "three";

const Planets = ({
  scene,
  planetsRef,
  PLANETS_DATA,
  PLANETS_COLORS,
  isDarkMode,
  planetsState,
  loader,
}) => {
  // This is a helper, not a React component, so call it from useEffect in SolarSystem.jsx
  // Example usage: Planets({scene, planetsRef, ...})

  // Remove old planets if any
  planetsRef.current.forEach(p => scene.remove(p.mesh));

  const themeColors = isDarkMode ? PLANETS_COLORS.dark : PLANETS_COLORS.light;
  planetsRef.current = PLANETS_DATA.map((planet, i) => {
    const texture = loader.load(`/textures/${planet.texture}`);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: themeColors[i],
    });
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    return {
      name: planet.name,
      mesh,
      distance: planet.distance,
      speed: planetsState[i]?.speed ?? 0.01,
      angle: Math.random() * Math.PI * 2,
      rotationSpeed: 0.01 + Math.random() * 0.01,
    };
  });
};

export default Planets;