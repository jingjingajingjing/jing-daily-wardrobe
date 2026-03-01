import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { genBlock } from './utils/bem';
import { useSwipe } from './hooks/useSwipe';
import { useDragDrop } from './hooks/useDragDrop';
import { ALL_OUTFITS, CLOTHING_ITEMS } from './constants/wardrobe';
import { MatchZone } from './components/MatchZone';
import { ClothingGrid } from './components/ClothingGrid';
import './App.less';

const { block } = genBlock('wardrobe');

type TabType = 'recommend' | 'match';

const App = () => {
  const [temp, setTemp] = useState<number>(5);
  const [weather, setWeather] = useState('阴');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedOutfits, setSuggestedOutfits] = useState(ALL_OUTFITS);
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
    setCurrentIndex((i) => (i - 1 + suggestedOutfits.length) % suggestedOutfits.length);
  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % suggestedOutfits.length);

  const swipe = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  });

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
          const filtered = ALL_OUTFITS.filter(
            (item) => currentTemp >= item.minTemp && currentTemp <= item.maxTemp
          );
          setSuggestedOutfits(
            filtered.length > 0
              ? filtered
              : [{ name: '随便穿穿，心情最重要', minTemp: -100, maxTemp: 100 }]
          );
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
          <p>今天心情怎么样呀!</p>
          <p>静静你穿啥都好看</p>
          <p className={block('outfit-name')}>
            {suggestedOutfits[safeIndex]?.name}
          </p>
          <div
            className={block('image-wrapper')}
            onTouchStart={swipe.handleTouchStart}
            onTouchEnd={swipe.handleTouchEnd}
          >
            <img
              className={block('image')}
              src={suggestedOutfits[safeIndex]?.imageUrl}
              alt={suggestedOutfits[safeIndex]?.name}
            />
          </div>
          <p className={block('swipe-hint')}>👆 左右滑动可切换</p>
          <button
            className={block('switch-btn')}
            onClick={goNext}
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
