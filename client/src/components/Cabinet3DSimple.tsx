import React, { useState, useRef, useEffect } from "react";

interface CabinetConfig {
  width: number;
  height: number;
  depth: number;
  numberOfCompartments: number;
  numberOfShelves: number;
  numberOfDoors: number;
  numberOfDrawers: number;
  hasClothingRail: boolean;
  material: string;
}

interface Shelf {
  id: string;
  position: number; // 0-100 (percentage of height)
  type: "shelf" | "hanger" | "drawer";
}

interface Cabinet3DSimpleProps {
  config: CabinetConfig;
}

export function Cabinet3DSimple({ config }: Cabinet3DSimpleProps) {
  const [shelves, setShelves] = useState<Shelf[]>([
    { id: "1", position: 25, type: "shelf" },
    { id: "2", position: 50, type: "shelf" },
    { id: "3", position: 75, type: "hanger" },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const containerHeight = 400; // pixels
  const containerWidth = 300; // pixels

  useEffect(() => {
    if (!draggingId) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeY = e.clientY - rect.top;
      const percentage = Math.max(0, Math.min(100, (relativeY / containerHeight) * 100));

      setShelves((prev) =>
        prev.map((shelf) =>
          shelf.id === draggingId ? { ...shelf, position: percentage } : shelf
        )
      );
    };

    const handleMouseUp = () => {
      setDraggingId(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, containerHeight]);

  const handleMouseDown = (id: string) => {
    setDraggingId(id);
  };

  const addShelf = () => {
    const newId = String(Date.now());
    setShelves((prev) => [...prev, { id: newId, position: 50, type: "shelf" }]);
  };

  const removeShelf = (id: string) => {
    setShelves((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleType = (id: string) => {
    setShelves((prev) =>
      prev.map((shelf) => {
        if (shelf.id === id) {
          const types: Array<"shelf" | "hanger" | "drawer"> = ["shelf", "hanger", "drawer"];
          const currentIndex = types.indexOf(shelf.type);
          const nextType = types[(currentIndex + 1) % types.length];
          return { ...shelf, type: nextType };
        }
        return shelf;
      })
    );
  };

  const getTypeLabel = (type: string, position?: number) => {
    const positionLabel = position !== undefined ? getPositionLabel(position) : "";
    switch (type) {
      case "shelf":
        return `Plank${positionLabel}`;
      case "hanger":
        return `Kledingstang${positionLabel}`;
      case "drawer":
        return `Lade${positionLabel}`;
      default:
        return type;
    }
  };

  const getPositionLabel = (position: number) => {
    if (position < 20) return " (onderaan)";
    if (position < 40) return " (lager)";
    if (position < 60) return " (midden)";
    if (position < 80) return " (hoger)";
    return " (bovenaan)";
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "shelf":
        return "bg-blue-600";
      case "hanger":
        return "bg-orange-600";
      case "drawer":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Cabinet Preview */}
      <div
        ref={containerRef}
        className="border-4 border-gray-900 relative overflow-hidden select-none shadow-lg"
        style={{
          width: containerWidth,
          height: containerHeight,
          backgroundColor: '#ffffff',
        }}
      >
        {/* Dimension Labels */}
        <div className="absolute top-2 left-2 text-xs font-bold text-white bg-gray-900 px-3 py-2 rounded pointer-events-none shadow-md">
          {config.width} × {config.height} × {config.depth} cm
        </div>

        {/* Shelves/Hangers/Drawers */}
        {shelves.map((shelf) => (
          <div
            key={shelf.id}
            className={`absolute left-0 right-0 h-3 cursor-grab active:cursor-grabbing transition-all hover:h-4 ${getTypeColor(
              shelf.type
            )} ${draggingId === shelf.id ? "ring-2 ring-yellow-300" : ""}`}
            style={{
              top: `${shelf.position}%`,
              transform: "translateY(-50%)",
              zIndex: draggingId === shelf.id ? 10 : 1,
            }}
            onMouseDown={() => handleMouseDown(shelf.id)}
            title={getTypeLabel(shelf.type, shelf.position)}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <button
          onClick={addShelf}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
        >
          + Legger toevoegen
        </button>

        {/* Shelf List */}
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {shelves.map((shelf) => (
            <div
              key={shelf.id}
              className="flex items-center justify-between bg-gray-100 p-2 rounded text-sm border border-gray-200"
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className={`w-3 h-3 rounded ${getTypeColor(shelf.type)}`}
                />
                <span className="font-medium">{getTypeLabel(shelf.type, shelf.position)}</span>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => toggleType(shelf.id)}
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded text-xs font-medium transition-colors"
                  title="Wijzig type"
                >
                  ↻
                </button>
                <button
                  onClick={() => removeShelf(shelf.id)}
                  className="px-2 py-1 bg-red-300 hover:bg-red-400 rounded text-xs font-medium transition-colors"
                  title="Verwijder"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded border border-blue-200">
        <p className="font-semibold mb-1">📋 Instructies:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Sleep leggers omhoog/omlaag om te verplaatsen</li>
          <li>Klik ↻ om type te wijzigen (legger → hanger → lade)</li>
          <li>Klik ✕ om te verwijderen</li>
          <li>Klik + om een legger toe te voegen</li>
        </ul>
      </div>
    </div>
  );
}
