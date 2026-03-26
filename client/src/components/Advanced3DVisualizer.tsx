import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Advanced3DVisualizerProps {
  config: any;
  width?: number;
  height?: number;
}

export default function Advanced3DVisualizer({
  config,
  width = 800,
  height = 600,
}: Advanced3DVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    scene.fog = new THREE.Fog(0xf5f5f5, 1000, 10000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(150, 150, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -300;
    directionalLight.shadow.camera.right = 300;
    directionalLight.shadow.camera.top = 300;
    directionalLight.shadow.camera.bottom = -300;
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create product based on type
    const createProduct = () => {
      if (config.productType === "cabinet") {
        createCabinet(scene, config);
      } else if (config.productType === "loft_cabinet") {
        createLoftCabinet(scene, config);
      } else if (config.productType === "tv_furniture") {
        createTVFurniture(scene, config);
      } else if (config.productType === "stairs") {
        createStairs(scene, config);
      }
      setIsLoading(false);
    };

    createProduct();

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !cameraRef.current) return;

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const radius = Math.sqrt(
        cameraRef.current.position.x ** 2 +
          cameraRef.current.position.y ** 2 +
          cameraRef.current.position.z ** 2
      );

      let theta = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
      let phi = Math.acos(cameraRef.current.position.y / radius);

      theta -= deltaX * 0.005;
      phi -= deltaY * 0.005;

      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

      cameraRef.current.position.x = radius * Math.sin(phi) * Math.cos(theta);
      cameraRef.current.position.y = radius * Math.cos(phi);
      cameraRef.current.position.z = radius * Math.sin(phi) * Math.sin(theta);
      cameraRef.current.lookAt(0, 50, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;

      const direction = cameraRef.current.position.clone().normalize();
      const distance = cameraRef.current.position.length();
      const newDistance = Math.max(50, Math.min(500, distance + e.deltaY * 0.1));
      const scale = newDistance / distance;

      cameraRef.current.position.multiplyScalar(scale);
      cameraRef.current.lookAt(0, 50, 0);
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [config, width, height]);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <div ref={containerRef} className="w-full h-full" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="text-white text-lg font-semibold">3D model laden...</div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg">
        <p>Draai: Sleep met muis</p>
        <p>Zoom: Scroll wiel</p>
      </div>
    </div>
  );
}

// Helper functions to create different product types
function createCabinet(scene: THREE.Scene, config: any) {
  const { width, height, depth } = config;
  const material = createMaterial(config.material, config.finish);

  // Main box
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const cabinet = new THREE.Mesh(geometry, material);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  cabinet.position.y = height / 2;
  scene.add(cabinet);

  // Add doors if specified
  if (config.numberOfDoors > 0) {
    const doorWidth = width / config.numberOfDoors;
    for (let i = 0; i < config.numberOfDoors; i++) {
      const doorGeometry = new THREE.BoxGeometry(doorWidth - 2, height - 4, 2);
      const door = new THREE.Mesh(doorGeometry, material);
      door.castShadow = true;
      door.position.set(
        -width / 2 + (i + 0.5) * doorWidth,
        height / 2,
        depth / 2 + 1
      );
      scene.add(door);
    }
  }
}

function createLoftCabinet(scene: THREE.Scene, config: any) {
  const { width, height, depth, slopeHeight, slopeAngle } = config;
  const material = createMaterial(config.material, config.finish);

  // Main body
  const bodyGeometry = new THREE.BoxGeometry(width, height - slopeHeight, depth);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.castShadow = true;
  body.position.y = (height - slopeHeight) / 2;
  scene.add(body);

  // Sloped top
  const slopeRad = (slopeAngle * Math.PI) / 180;
  const slopeLength = slopeHeight / Math.sin(slopeRad);
  const slopeGeometry = new THREE.BoxGeometry(width, 2, slopeLength);
  const slope = new THREE.Mesh(slopeGeometry, material);
  slope.castShadow = true;
  slope.rotation.z = slopeRad;
  slope.position.y = height - slopeHeight / 2;
  slope.position.z = depth / 2 - slopeLength / 2 * Math.cos(slopeRad);
  scene.add(slope);
}

function createTVFurniture(scene: THREE.Scene, config: any) {
  const { width, height, depth } = config;
  const material = createMaterial(config.material, config.finish);

  // Main cabinet
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const cabinet = new THREE.Mesh(geometry, material);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  cabinet.position.y = height / 2;
  scene.add(cabinet);

  // TV space (recessed)
  const tvGeometry = new THREE.BoxGeometry(width - 20, height - 40, 10);
  const tvMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const tvSpace = new THREE.Mesh(tvGeometry, tvMaterial);
  tvSpace.position.set(0, height / 2, depth / 2 - 5);
  scene.add(tvSpace);
}

function createStairs(scene: THREE.Scene, config: any) {
  const { numberOfSteps, width, material: materialType, finish } = config;
  const material = createMaterial(materialType, finish);
  const stepHeight = 18; // cm
  const stepDepth = 28; // cm

  for (let i = 0; i < numberOfSteps; i++) {
    const stepGeometry = new THREE.BoxGeometry(width, stepHeight, stepDepth);
    const step = new THREE.Mesh(stepGeometry, material);
    step.castShadow = true;
    step.receiveShadow = true;
    step.position.set(0, (i + 0.5) * stepHeight, i * stepDepth);
    scene.add(step);
  }
}

function createMaterial(materialType: string, finishType: string): THREE.Material {
  const colors: Record<string, number> = {
    oak: 0xd4a574,
    beech: 0xe8c4a0,
    walnut: 0x5c4033,
    mdf_lacquered: 0xf5f5f5,
    plywood: 0xc9a961,
  };

  const roughness: Record<string, number> = {
    oil: 0.7,
    matte_lacquer: 0.8,
    high_gloss: 0.1,
    matte_paint: 0.9,
  };

  const metalness: Record<string, number> = {
    oil: 0.0,
    matte_lacquer: 0.0,
    high_gloss: 0.3,
    matte_paint: 0.0,
  };

  return new THREE.MeshStandardMaterial({
    color: colors[materialType] || 0xcccccc,
    roughness: roughness[finishType] || 0.5,
    metalness: metalness[finishType] || 0.0,
  });
}
