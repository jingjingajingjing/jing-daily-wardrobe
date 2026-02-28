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

  // 移动端：点击/触摸选择物品，再次点击同一物品则取消选择
  const handleSelectItem = useCallback((item: DraggedItem) => {
    setDragging((prev) => (prev?.id === item.id ? null : item));
  }, []);

  // 移动端：点击/触摸搭配区槽位放入已选物品
  const handleSlotTap = useCallback(
    (category: string) => {
      if (!dragging || dragging.category !== category) return;
      setMatched((prev) => ({ ...prev, [category]: dragging }));
      setDragging(null);
    },
    [dragging]
  );

  return {
    matched,
    dragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleSelectItem,
    handleSlotTap,
    clearMatch,
  };
}
