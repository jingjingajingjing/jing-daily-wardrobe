import React, { useRef } from 'react';
import { genBlock } from '../utils/bem';
import type { ClothingItem } from '../constants/wardrobe';
import type { DraggedItem } from '../hooks/useDragDrop';
import { CATEGORY_LABELS } from '../constants/wardrobe';
import './ClothingGrid.less';

const { block } = genBlock('clothing-grid');

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
                    onTouchEnd={(e) => {
                      touchHandledRef.current = true;
                      e.preventDefault();
                      onSelectItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, category: item.category });
                    }}
                    onClick={() => {
                      if (touchHandledRef.current) {
                        touchHandledRef.current = false;
                        return;
                      }
                      onSelectItem({ id: item.id, name: item.name, imageUrl: item.imageUrl, category: item.category });
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
