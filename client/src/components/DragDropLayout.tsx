import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Copy, RotateCcw } from "lucide-react";

export type InteriorElement = "shelf" | "drawer" | "clothing_rail" | "divider" | "door" | "open_space";

export interface LayoutElement {
  id: string;
  type: InteriorElement;
  x: number; // cm
  y: number; // cm
  z: number; // cm
  width: number;
  height: number;
  depth: number;
}

interface DragDropLayoutProps {
  cabinetWidth: number;
  cabinetHeight: number;
  cabinetDepth: number;
  elements: LayoutElement[];
  onElementsChange: (elements: LayoutElement[]) => void;
}

const ELEMENT_SPECS: Record<InteriorElement, { width: number; height: number; depth: number; color: string; label: string }> = {
  shelf: { width: 100, height: 2, depth: 50, color: "bg-amber-200", label: "Plank" },
  drawer: { width: 100, height: 20, depth: 50, color: "bg-blue-200", label: "Lade" },
  clothing_rail: { width: 100, height: 3, depth: 50, color: "bg-purple-200", label: "Kledingstang" },
  divider: { width: 2, height: 100, depth: 50, color: "bg-gray-300", label: "Verdeler" },
  door: { width: 100, height: 100, depth: 2, color: "bg-orange-200", label: "Deur" },
  open_space: { width: 100, height: 100, depth: 50, color: "bg-green-100", label: "Open Vak" },
};

export default function DragDropLayout({
  cabinetWidth,
  cabinetHeight,
  cabinetDepth,
  elements,
  onElementsChange,
}: DragDropLayoutProps) {
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<LayoutElement[][]>([elements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const scale = 2; // pixels per cm

  const addElement = useCallback((type: InteriorElement) => {
    const spec = ELEMENT_SPECS[type];
    const newElement: LayoutElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 10,
      y: 10,
      z: 0,
      width: spec.width,
      height: spec.height,
      depth: spec.depth,
    };
    const newElements = [...elements, newElement];
    updateElements(newElements);
  }, [elements]);

  const updateElements = (newElements: LayoutElement[]) => {
    onElementsChange(newElements);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter((el) => el.id !== id);
    updateElements(newElements);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (!element) return;
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
    };
    updateElements([...elements, newElement]);
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    const element = elements.find((el) => el.id === elementId);
    if (!element) return;

    const rect = (e.currentTarget as HTMLElement).parentElement?.getBoundingClientRect();
    if (!rect) return;

    setDraggedElement(elementId);
    setDragOffset({
      x: e.clientX - rect.left - element.x * scale,
      y: e.clientY - rect.top - element.y * scale,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElement) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const element = elements.find((el) => el.id === draggedElement);
    if (!element) return;

    const newX = Math.max(0, Math.min(cabinetWidth - element.width, (e.clientX - rect.left - dragOffset.x) / scale));
    const newY = Math.max(0, Math.min(cabinetHeight - element.height, (e.clientY - rect.top - dragOffset.y) / scale));

    const newElements = elements.map((el) =>
      el.id === draggedElement ? { ...el, x: newX, y: newY } : el
    );
    onElementsChange(newElements);
  };

  const handleMouseUp = () => {
    if (draggedElement) {
      updateElements(elements);
      setDraggedElement(null);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onElementsChange(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onElementsChange(history[newIndex]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {Object.entries(ELEMENT_SPECS).map(([type, spec]) => (
            <Button
              key={type}
              size="sm"
              variant="outline"
              onClick={() => addElement(type as InteriorElement)}
              className="text-xs"
            >
              + {spec.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={undo} disabled={historyIndex === 0}>
            ↶ Ongedaan maken
          </Button>
          <Button size="sm" variant="outline" onClick={redo} disabled={historyIndex === history.length - 1}>
            ↷ Opnieuw
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <Card className="p-4 bg-white border-2 border-gray-300">
        <div
          className="relative bg-gray-50 border-2 border-dashed border-gray-400 overflow-hidden"
          style={{
            width: cabinetWidth * scale,
            height: cabinetHeight * scale,
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Grid background */}
          <svg
            className="absolute inset-0 opacity-20"
            width="100%"
            height="100%"
          >
            <defs>
              <pattern id="grid" width={10 * scale} height={10 * scale} patternUnits="userSpaceOnUse">
                <path d={`M ${10 * scale} 0 L 0 0 0 ${10 * scale}`} fill="none" stroke="gray" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Elements */}
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute cursor-move border-2 border-gray-600 transition-shadow ${
                ELEMENT_SPECS[element.type].color
              } ${draggedElement === element.id ? "shadow-lg z-10" : ""}`}
              style={{
                left: element.x * scale,
                top: element.y * scale,
                width: element.width * scale,
                height: element.height * scale,
              }}
              onMouseDown={(e) => handleMouseDown(e, element.id)}
            >
              <div className="h-full flex flex-col items-center justify-center text-xs font-semibold text-gray-700 p-1">
                <span>{ELEMENT_SPECS[element.type].label}</span>
                <span className="text-xs text-gray-600">
                  {element.width.toFixed(0)}×{element.height.toFixed(0)}
                </span>
              </div>

              {/* Element controls */}
              <div className="absolute -top-6 left-0 flex gap-1 opacity-0 hover:opacity-100 transition">
                <button
                  className="p-1 bg-blue-500 text-white rounded text-xs"
                  onClick={() => duplicateElement(element.id)}
                  title="Dupliceren"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  className="p-1 bg-red-500 text-white rounded text-xs"
                  onClick={() => deleteElement(element.id)}
                  title="Verwijderen"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Info */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>Kast afmetingen: {cabinetWidth}×{cabinetHeight}×{cabinetDepth} cm</p>
        <p>Elementen: {elements.length}</p>
        <p className="text-xs">Sleep elementen om ze te verplaatsen. Hover voor verwijderen/dupliceren.</p>
      </div>
    </div>
  );
}
