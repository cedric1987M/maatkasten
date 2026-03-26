import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CabinetConfig {
  width: number;
  height: number;
  depth: number;
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDoors: number;
  numberOfDrawers: number;
  hasClothingRail: boolean;
  material: "white_melamine" | "oak_decor" | "black_decor" | "mdf_white_ral9016" | "mdf_grey_ral7035" | "mdf_grey_ral7038" | "mdf_green_ral6029" | "mdf_blue_ral5002" | "mdf_red_ral3020" | "mdf_cream_ral1015" | "mdf_brown_ral8017";
}

const MATERIAL_COLORS: Record<string, number> = {
  white_melamine: 0xf5f5f5,
  oak_decor: 0xd4a574,
  black_decor: 0x1a1a1a,
};

export function Cabinet3D({ config }: { config: CabinetConfig }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cabinetGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      (config.width / 100) * 0.8,
      (config.height / 100) * 0.6,
      (config.depth / 100) * 1.2
    );
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -(config.depth / 100) * 0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create cabinet group
    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.set(0, 0, 0);
    scene.add(cabinetGroup);
    cabinetGroupRef.current = cabinetGroup;

    // Material
    const materialColor = MATERIAL_COLORS[config.material] || MATERIAL_COLORS.white_melamine;
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: materialColor,
      metalness: 0.1,
      roughness: 0.8,
    });

    // Convert cm to Three.js units (1cm = 0.01 units)
    const w = config.width / 100;
    const h = config.height / 100;
    const d = config.depth / 100;
    const thickness = 0.018; // 1.8cm panel thickness

    // Helper function to create a panel
    const createPanel = (
      width: number,
      height: number,
      depth: number,
      x: number,
      y: number,
      z: number
    ) => {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geometry, panelMaterial);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      return mesh;
    };

    // Create sides
    const leftSide = createPanel(thickness, h, d, -w / 2, h / 2, 0);
    const rightSide = createPanel(thickness, h, d, w / 2, h / 2, 0);
    cabinetGroup.add(leftSide, rightSide);

    // Create top and bottom
    const top = createPanel(w, thickness, d, 0, h, 0);
    const bottom = createPanel(w, thickness, d, 0, 0, 0);
    cabinetGroup.add(top, bottom);

    // Create back panel
    const back = createPanel(w, h, thickness, 0, h / 2, -d / 2);
    cabinetGroup.add(back);

    // Create compartment dividers
    const compartmentWidth = w / config.numberOfCompartments;
    for (let i = 1; i < config.numberOfCompartments; i++) {
      const divider = createPanel(
        thickness,
        h - thickness * 2,
        d,
        -w / 2 + compartmentWidth * i,
        h / 2,
        0
      );
      cabinetGroup.add(divider);
    }

    // Create shelves
    if (config.numberOfShelves > 0) {
      const shelfHeight = (h - thickness * 2) / (config.numberOfShelves + 1);
      for (let comp = 0; comp < config.numberOfCompartments; comp++) {
        for (let shelf = 1; shelf <= config.numberOfShelves; shelf++) {
          const shelfX =
            -w / 2 + compartmentWidth * comp + compartmentWidth / 2;
          const shelfY = thickness + shelfHeight * shelf;
          const shelfPanel = createPanel(
            compartmentWidth - thickness * 2,
            thickness,
            d - thickness * 2,
            shelfX,
            shelfY,
            0
          );
          cabinetGroup.add(shelfPanel);
        }
      }
    }

    // Create doors
    if (config.numberOfDoors > 0) {
      const doorWidth = w / config.numberOfDoors;
      const doorMaterial = new THREE.MeshStandardMaterial({
        color: materialColor,
        metalness: 0.2,
        roughness: 0.7,
      });

      for (let i = 0; i < config.numberOfDoors; i++) {
        const doorX = -w / 2 + doorWidth * i + doorWidth / 2;
        const doorGeometry = new THREE.BoxGeometry(
          doorWidth - thickness * 2,
          h - thickness * 2,
          thickness
        );
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(doorX, h / 2, d / 2 + thickness);
        door.castShadow = true;
        door.receiveShadow = true;
        cabinetGroup.add(door);
      }
    }

    // Create drawers
    if (config.numberOfDrawers > 0) {
      const drawerHeight = (h - thickness * 2) / config.numberOfDrawers;
      const drawerMaterial = new THREE.MeshStandardMaterial({
        color: materialColor,
        metalness: 0.15,
        roughness: 0.75,
      });

      for (let i = 0; i < config.numberOfDrawers; i++) {
        const drawerY = thickness + drawerHeight * i + drawerHeight / 2;
        const drawerGeometry = new THREE.BoxGeometry(
          w - thickness * 4,
          drawerHeight - thickness,
          d / 2
        );
        const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial);
        drawer.position.set(0, drawerY, d / 4);
        drawer.castShadow = true;
        drawer.receiveShadow = true;
        cabinetGroup.add(drawer);
      }
    }

    // Add dimension labels using canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = 'black';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${config.width} cm`, 256, 150);
      ctx.fillText(`${config.height} cm`, 256, 256);
      ctx.fillText(`${config.depth} cm`, 256, 362);
    }
    const texture = new THREE.CanvasTexture(canvas);
    const labelGeometry = new THREE.PlaneGeometry(4, 3);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: texture });
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, h + 1, 0);
    cabinetGroup.add(label);

    // Create clothing rail
    if (config.hasClothingRail) {
      const railGeometry = new THREE.CylinderGeometry(0.01, 0.01, w - thickness * 4, 8);
      const railMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.8,
        roughness: 0.2,
      });
      const rail = new THREE.Mesh(railGeometry, railMaterial);
      rail.rotation.z = Math.PI / 2;
      rail.position.set(0, h * 0.75, 0);
      rail.castShadow = true;
      rail.receiveShadow = true;
      cabinetGroup.add(rail);
    }

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    renderer.domElement.addEventListener("mousedown", (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
      if (isDragging && cabinetGroup) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        cabinetGroup.rotation.y += deltaX * 0.01;
        cabinetGroup.rotation.x += deltaY * 0.01;

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });

    renderer.domElement.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Wheel zoom
    renderer.domElement.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      if (e.deltaY > 0) {
        camera.position.multiplyScalar(1 + zoomSpeed);
      } else {
        camera.position.multiplyScalar(1 - zoomSpeed);
      }
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, camera);
      }
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (rendererRef.current) {
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && rendererRef.current?.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, [config]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full rounded-lg overflow-hidden bg-gray-100"
      style={{ minHeight: "600px" }}
    />
  );
}
