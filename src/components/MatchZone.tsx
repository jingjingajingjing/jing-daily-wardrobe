import React, { memo } from 'react';
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

export const MatchZone = memo(function MatchZone({
  matched,
  onDrop,
  onDragOver,
  onSlotTap,
  onClear,
  dragging,
}: MatchZoneProps) {
  return (
    <section className={block()} aria-label="穿搭搭配区">
      <h3 className={block('title')}>穿搭搭配区</h3>
      <div className={block('slots')}>
        {CATEGORIES.map((cat) => (
          <div
            key={cat}
            className={`${block('slot')} ${matched[cat] ? block('slot', 'filled') : ''} ${
              dragging?.category === cat ? block('slot', 'ready') : ''
            }`}
            role={matched[cat] ? undefined : 'button'}
            tabIndex={matched[cat] ? undefined : 0}
            aria-label={
              matched[cat] ? undefined : `${CATEGORY_LABELS[cat]}搭配槽`
            }
            onDrop={(e) => onDrop(e, cat)}
            onDragOver={onDragOver}
            onTouchEnd={(e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              e.preventDefault();
              if (matched[cat]) return;
              onSlotTap(cat);
            }}
            onClick={() => {
              if (!matched[cat]) onSlotTap(cat);
            }}
            onKeyDown={(e) => {
              if (matched[cat]) return;
              if (e.key !== 'Enter' && e.key !== ' ') return;
              e.preventDefault();
              onSlotTap(cat);
            }}
          >
            <span className={block('slot-label')}>{CATEGORY_LABELS[cat]}</span>
            {matched[cat] ? (
              <div className={block('slot-content')}>
                <img src={matched[cat].imageUrl} alt="" aria-hidden="true" />
                <span>{matched[cat].name}</span>
                <button
                  type="button"
                  className={block('slot-clear')}
                  aria-label={`移除${matched[cat].name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear(cat);
                  }}
                >
                  移除
                </button>
              </div>
            ) : (
              <span className={block('slot-placeholder')}>
                {dragging?.category === cat ? '可放入' : '待搭配'}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
});
