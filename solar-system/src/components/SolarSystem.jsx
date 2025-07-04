import { useEffect, useRef, useState, useCallback } from "react";
import Controls from "./Controls";
import SceneSetup from "./SceneSetup";
import Planets from "./Planets";
import OrbitLines from "./OrbitLines";
import Starfield from "./Starfield";
import Labels from "./Labels";
import * as THREE from "three";

const PLANETS_COLORS = {
  dark: [
    0xd9d9d9, 0xffe5b4, 0x4f90ff, 0xff7f50,
    0xf7c873, 0xfafad2, 0x7fffd4, 0x6495ed,
  ],
  light: [
    0x8d8d8d, 0xc2b280, 0x1e90ff, 0xb22222,
    0xe2b07a, 0xf7e7b6, 0x7ad7f0, 0x4063d8,
  ],
};

const PLANETS_DATA = [
  { name: "Mercury", size: 0.5, distance: 8, texture: "mercury.jpg"  },
  { name: "Venus", size: 0.9, distance: 11, texture: "venus.jpg" },
  { name: "Earth", size: 1, distance: 14, texture: "earth.jpg" },
  { name: "Mars", size: 0.8, distance: 17, texture: "mars.jpg" },
  { name: "Jupiter", size: 2.5, distance: 22, texture: "jupiter.jpg"  },
  { name: "Saturn", size: 2, distance: 27, texture: "saturn.jpg" },
  { name: "Uranus", size: 1.5, distance: 32, texture: "uranus.jpg" },
  { name: "Neptune", size: 1.5, distance: 37, texture: "neptune.jpg" },
];

const SolarSystem = ({ isDarkMode }) => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const planetsRef = useRef([]);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneObjects, setSceneObjects] = useState({});
  const [planetsState, setPlanetsState] = useState(
    PLANETS_DATA.map((p) => ({ name: p.name, speed: 0.01 }))
  );
  const [pausedLabel, setPausedLabel] = useState(false);
  const isPaused = useRef(false);
  const [label, setLabel] = useState({ visible: false, name: "", x: 0, y: 0 });

  // Called by SceneSetup when scene/camera/renderer are ready
  const handleSceneReady = useCallback(({ scene, camera, renderer }) => {
    setSceneObjects({ scene, camera, renderer });
    setSceneReady(true);
  }, []);

  // Handle speed slider changes
  const handleSpeedChange = (planetName, newSpeed) => {
    setPlanetsState((prev) =>
      prev.map((p) =>
        p.name === planetName ? { ...p, speed: newSpeed } : p
      )
    );
    planetsRef.current.forEach((p) => {
      if (p.name === planetName) p.speed = newSpeed;
    });
  };

  // Pause/resume
  const togglePause = () => {
    isPaused.current = !isPaused.current;
    setPausedLabel(isPaused.current);
  };

  // Main effect: add planets, orbits, starfield, animation, events
  useEffect(() => {
    if (!sceneReady) return;
    const { scene, camera, renderer } = sceneObjects;
    if (!scene || !camera || !renderer) return;

    // Remove all children except lights (for theme switch)
    scene.children = scene.children.filter(obj => obj.type === "AmbientLight" || obj.type === "PointLight");

    // Add starfield
    Starfield({ scene, isDarkMode });

    // Add orbit lines
    OrbitLines({ scene, PLANETS_DATA, isDarkMode });

    // Add planets
    const loader = new THREE.TextureLoader();
    Planets({
      scene,
      planetsRef,
      PLANETS_DATA,
      PLANETS_COLORS,
      isDarkMode,
      planetsState,
      loader,
    });

    // Add sun 
    const sunTexture = loader.load("/textures/sun.jpg");
    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseMove(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        planetsRef.current.map((p) => p.mesh)
      );

      if (intersects.length > 0) {
        const intersect = intersects[0];
        const planet = planetsRef.current.find((p) => p.mesh === intersect.object);
        if (planet) {
          setLabel({
            visible: true,
            name: planet.name,
            x: event.clientX + 10,
            y: event.clientY + 10,
          });
        }
      } else {
        setLabel((l) => ({ ...l, visible: false }));
      }
    }

    renderer.domElement.addEventListener("mousemove", onMouseMove);

    // Resize
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationId;
    const clock = new THREE.Clock();

    function animate() {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      planetsRef.current.forEach((planet, i) => {
        planet.speed = planetsState[i]?.speed ?? planet.speed;
        if (!isPaused.current) {
          planet.angle += planet.speed;
          planet.mesh.rotation.y += planet.rotationSpeed * delta;
        }
        planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
        planet.mesh.position.z = planet.distance * Math.sin(planet.angle);
      });

      controlsRef.current && controlsRef.current.update();
      renderer.render(scene, camera);
    }
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationId);
      setLabel({ visible: false, name: "", x: 0, y: 0 });
    };
  }, [sceneReady, isDarkMode, planetsState, sceneObjects]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* Three.js canvas will be mounted here */}
      <div
        ref={mountRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "auto",
        }}
      />
      {/* Scene setup (mounts renderer/camera/lights/controls) */}
      <SceneSetup
        isDarkMode={isDarkMode}
        mountRef={mountRef}
        controlsRef={controlsRef}
        onSceneReady={handleSceneReady}
      />
      {/* UI Layer */}
      <div style={{ position: "fixed", inset: 0, zIndex: 2, pointerEvents: "none" }}>
        {/* Pause Button */}
        <button
          onClick={togglePause}
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          style={{ pointerEvents: "auto", zIndex: 3 }}
        >
          {pausedLabel ? "Resume" : "Pause"}
        </button>
        {/* Controls */}
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            pointerEvents: "auto",
            zIndex: 3,
          }}
        >
          <Controls planets={planetsState} onSpeedChange={handleSpeedChange} />
        </div>
        {/* Labels */}
        <Labels label={label} isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default SolarSystem;