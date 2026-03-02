import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { genBlock } from './utils/bem';
import { useDragDrop } from './hooks/useDragDrop';
import { ALL_OUTFITS, CLOTHING_ITEMS, Outfit } from './constants/wardrobe';

const getFilteredOutfits = (temp: number): Outfit[] => {
  const filtered = ALL_OUTFITS.filter(
    (item) => temp >= item.minTemp && temp <= item.maxTemp
  );
  return filtered.length > 0
    ? filtered
    : [{ name: '随便穿穿，心情最重要', minTemp: -100, maxTemp: 100 }];
};
import { MatchZone } from './components/MatchZone';
import { ClothingGrid } from './components/ClothingGrid';
import './App.less';

const { block } = genBlock('wardrobe');

type TabType = 'recommend' | 'match';

const App = () => {
  const [temp, setTemp] = useState<number>(5);
  const [weather, setWeather] = useState('阴');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedOutfits, setSuggestedOutfits] = useState(() => getFilteredOutfits(5));
  const [activeTab, setActiveTab] = useState<TabType>('recommend');
  const {
    matched,
    dragging,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDragOver,
    handleSelectItem,
    handleSlotTap,
    clearMatch,
  } = useDragDrop();

  const safeIndex =
    suggestedOutfits.length > 0 ? currentIndex % suggestedOutfits.length : 0;
  const goPrev = () =>
    setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(suggestedOutfits.length - 1, i + 1));
  // 换一套看看：独立于箭头，可无限循环浏览
  const cycleNext = () =>
    setCurrentIndex((i) => (i + 1) % Math.max(1, suggestedOutfits.length));

  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < suggestedOutfits.length - 1;

  useEffect(() => {
    axios
      .get(
        `https://devapi.qweather.com/v7/weather/now?location=101010100&key=你的KEY`
      )
      .then((res) => {
        if (res.data.code === '200') {
          const currentTemp = Number(res.data.now.temp);
          setTemp(currentTemp);
          setWeather(res.data.now.text);
          setSuggestedOutfits(getFilteredOutfits(currentTemp));
        }
      });
  }, []);

  return (
    <div className={block()}>
      <div className={block('tabs')}>
        <button
          className={`${block('tab')} ${activeTab === 'recommend' ? block('tab', 'active') : ''}`}
          onClick={() => setActiveTab('recommend')}
        >
          智能推荐
        </button>
        <button
          className={`${block('tab')} ${activeTab === 'match' ? block('tab', 'active') : ''}`}
          onClick={() => setActiveTab('match')}
        >
          自由搭配
        </button>
      </div>

      {activeTab === 'recommend' && (
        <div className={block('card')}>
          <h1>🌸 今天想穿啥，静静</h1>
          <p>
            北京当前天气：{temp}°C {weather}
          </p>
          <hr />
          <p>为你推荐 今日穿搭：</p>
          <p>静静你穿啥都好看</p>
          <p className={block('outfit-name')}>
            {suggestedOutfits[safeIndex]?.name}
          </p>
          <div className={block('carousel')}>
            {canGoPrev && (
              <button
                type="button"
                className={`${block('arrow-btn')} ${block('arrow-btn', 'left')}`}
                onClick={goPrev}
                aria-label="上一套"
              >
                ←
              </button>
            )}
            <div className={block('image-wrapper')}>
              <img
                className={block('image')}
                src={suggestedOutfits[safeIndex]?.imageUrl}
                alt={suggestedOutfits[safeIndex]?.name}
              />
            </div>
            {canGoNext && (
              <button
                type="button"
                className={`${block('arrow-btn')} ${block('arrow-btn', 'right')}`}
                onClick={goNext}
                aria-label="下一套"
              >
                →
              </button>
            )}
          </div>
          <button
            className={block('switch-btn')}
            onClick={cycleNext}
          >
            换一套看看
          </button>
        </div>
      )}

      {activeTab === 'match' && (
        <div className={block('match-wrap')}>
          <MatchZone
            matched={matched}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onSlotTap={handleSlotTap}
            onClear={clearMatch}
            dragging={dragging}
          />
          <ClothingGrid
            items={CLOTHING_ITEMS}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onSelectItem={handleSelectItem}
            dragging={dragging}
          />
        </div>
      )}
    </div>
  );
};

export default App;
