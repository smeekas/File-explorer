import { useEffect, useState } from "react";

function useSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [multiple, setMultiple] = useState(false);
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setMultiple(true);
      }
    };
    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Control") {
        setMultiple(false);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.addEventListener("keyup", keyUpHandler);
    };
  }, []);
  const resetSelection = () => {
    setSelected(new Set());
  };
  const addToSelection = (path: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev);
      if (!multiple) {
        newSet.clear();
        newSet.add(path);
      } else {
        if (newSet.has(path)) {
          newSet.delete(path);
        } else {
          newSet.add(path);
        }
      }
      return newSet;
    });
  };
  return {
    selected,
    addToSelection,
    resetSelection,
  };
}

export default useSelection;
