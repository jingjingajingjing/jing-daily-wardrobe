import React from 'react';
import { genBlock } from '../utils/bem';
import type { DraggedItem } from '../hooks/useDragDrop';
import { CATEGORY_LABELS } from '../constants/wardrobe';
import './MatchZone.less';

const { block } = genBlock('match-zone');

interface MatchZoneProps {
  matched: Record<string, DraggedItem>;
  onDrop: (e: React.DragEvent, category: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onSlotTap: (category: string) => void;
  onClear: (category: string) => void;
  dragging: DraggedItem | null;
}

const CATEGORIES = ['coat', 'trousers', 'skirt', 'shoes'] as const;

export const MatchZone: React.FC<MatchZoneProps> = ({
  matched,
  onDrop,
  onDragOver,
  onSlotTap,
  onClear,
  dragging,
}) => {
  return (
    <div className={block()}>
      <h3 className={block('title')}>穿搭搭配区</h3>
      <p className={block('hint')}>
        {typeof window !== 'undefined' && 'ontouchstart' in window
          ? '点击衣服选择，再点击对应槽位放入'
          : '拖拽或点击衣服到下方区域进行搭配'}
      </p>
      <div className={block('slots')}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className={`${block('slot')} ${matched[cat] ? block('slot', 'filled') : ''}`}
            onDrop={(e) => onDrop(e, cat)}
            onDragOver={onDragOver}
            onTouchEnd={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              e.preventDefault();
              onSlotTap(cat);
            }}
            onClick={() => onSlotTap(cat)}
          >
            <span className={block('slot-label')}>{CATEGORY_LABELS[cat]}</span>
            {matched[cat] ? (
              <div className={block('slot-content')}>
                <img src={matched[cat].imageUrl} alt={matched[cat].name} />
                <span>{matched[cat].name}</span>
                <button
                  type="button"
                  className={block('slot-clear')}
                  onClick={() => onClear(cat)}
                >
                  移除
                </button>
              </div>
            ) : (
              <span className={block('slot-placeholder')}>
                {dragging?.category === cat ? '松手放入' : '拖到此处'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
