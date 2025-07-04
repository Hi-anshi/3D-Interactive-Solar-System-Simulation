import * as THREE from "three";

const OrbitLines = ({ scene, PLANETS_DATA, isDarkMode }) => {
  // Remove old orbits if any (optional: keep references)
  PLANETS_DATA.forEach((planet) => {
    const orbitGeometry = new THREE.RingGeometry(
      planet.distance - 0.05,
      planet.distance + 0.05,
      64
    );
    const orbitMaterial = new THREE.MeshBasicMaterial({
      color: isDarkMode ? 0xffffff : 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
  });
};

export default OrbitLines;