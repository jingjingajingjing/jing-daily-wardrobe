import React, { useRef } from 'react';
import { genBlock } from '../utils/bem';
import type { ClothingItem } from '../constants/wardrobe';
import type { DraggedItem } from '../hooks/useDragDrop';
import { CATEGORY_LABELS } from '../constants/wardrobe';
import './ClothingGrid.less';

const { block } = genBlock('clothing-grid');

// 移动距离超过此阈值视为滑动，不触发选中
const TAP_THRESHOLD = 10;

interface ClothingGridProps {
  items: ClothingItem[];
  onDragStart: (e: React.DragEvent, item: DraggedItem) => void;
  onDragEnd: () => void;
  onSelectItem: (item: DraggedItem) => void;
  dragging: DraggedItem | null;
}

export const ClothingGrid: React.FC<ClothingGridProps> = ({
  items,
  onDragStart,
  onDragEnd,
  onSelectItem,
  dragging,
}) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchHandledRef = useRef(false);

  const byCategory = items.reduce<Record<string, ClothingItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className={block()}>
      <h3 className={block('title')}>我的衣柜</h3>
      {(['coat', 'trousers', 'skirt', 'shoes'] as const).map(
        (cat) =>
          byCategory[cat]?.length > 0 && (
            <div key={cat} className={block('category')}>
              <span className={block('category-label')}>{CATEGORY_LABELS[cat]}</span>
              <div className={block('list')}>
                {byCategory[cat].map((item) => (
                  <div
                    key={item.id}
                    className={`${block('item')} ${dragging?.id === item.id ? block('item', 'dragging') : ''}`}
                    draggable
                    onDragStart={(e) =>
                      onDragStart(e, {
                        id: item.id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        category: item.category,
                      })
                    }
                    onDragEnd={onDragEnd}
                    onTouchStart={(e) => {
                      touchStartRef.current = {
                        x: e.touches[0].clientX,
                        y: e.touches[0].clientY,
                      };
                    }}
                    onTouchEnd={(e) => {
                      touchHandledRef.current = true;
                      const start = touchStartRef.current;
                      touchStartRef.current = null;
                      if (!start) return;
                      const deltaX = Math.abs(e.changedTouches[0].clientX - start.x);
                      const deltaY = Math.abs(e.changedTouches[0].clientY - start.y);
                      // 水平或垂直移动超过阈值视为滑动，不触发选中
                      if (deltaX > TAP_THRESHOLD || deltaY > TAP_THRESHOLD) return;
                      const dragged: DraggedItem = {
                        id: item.id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        category: item.category,
                      };
                      onSelectItem(dragged);
                    }}
                    onClick={() => {
                      if (touchHandledRef.current) {
                        touchHandledRef.current = false;
                        return;
                      }
                      onSelectItem({
                        id: item.id,
                        name: item.name,
                        imageUrl: item.imageUrl,
                        category: item.category,
                      });
                    }}
                  >
                    <img src={item.imageUrl} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};
