import { useCallback, useState } from 'react';

export interface DraggedItem {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

export function useDragDrop() {
  const [matched, setMatched] = useState<Record<string, DraggedItem>>({});
  const [dragging, setDragging] = useState<DraggedItem | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, item: DraggedItem) => {
      setDragging(item);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/json', JSON.stringify(item));
      e.dataTransfer.setData('text/plain', item.id);
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    setDragging(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, category: string) => {
      e.preventDefault();
      if (!dragging) return;
      setMatched((prev) => ({ ...prev, [category]: dragging }));
      setDragging(null);
    },
    [dragging]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const clearMatch = useCallback((category: string) => {
    setMatched((prev) => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  }, []);

  return {
    matched,
    dragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    clearMatch,
  };
}
