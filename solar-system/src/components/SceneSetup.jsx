import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const SceneSetup = ({ isDarkMode, mountRef, controlsRef, onSceneReady }) => {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 60);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(isDarkMode ? 0x000000 : 0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.width = "100vw";
    renderer.domElement.style.height = "100vh";
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkMode ? 0.25 : 0.7);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, isDarkMode ? 1.2 : 2.5, 0, 2);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // OrbitControls
    controlsRef.current = new OrbitControls(camera, renderer.domElement);
    controlsRef.current.enableDamping = true;
    controlsRef.current.dampingFactor = 0.05;
    controlsRef.current.enablePan = true;
    controlsRef.current.enableZoom = true;
    controlsRef.current.minDistance = 10;
    controlsRef.current.maxDistance = 200;
    controlsRef.current.target.set(0, 0, 0);

    // Callback to parent with scene, camera, renderer
    onSceneReady({ scene, camera, renderer });

    // Cleanup
    return () => {
      renderer.dispose();
      controlsRef.current && controlsRef.current.dispose();
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode, mountRef, controlsRef, onSceneReady]);

  return null;
};

export default SceneSetup;