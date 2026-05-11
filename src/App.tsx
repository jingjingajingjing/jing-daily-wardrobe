import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { genBlock } from './utils/bem';
import { useDragDrop } from './hooks/useDragDrop';
import { ALL_OUTFITS, CLOTHING_ITEMS, Outfit } from './constants/wardrobe';
import { MatchZone } from './components/MatchZone';
import { ClothingGrid } from './components/ClothingGrid';
import './App.less';

type TabType = 'recommend' | 'match';
const DEFAULT_TEMP = 0;
const WEATHER_API_KEY = import.meta.env.VITE_QWEATHER_KEY;

const getFilteredOutfits = (temp: number): Outfit[] => {
  const filtered = ALL_OUTFITS.filter(
    (item) => temp >= item.minTemp && temp <= item.maxTemp
  );
  return filtered.length > 0
    ? filtered
    : [{ name: '随便穿穿，心情最重要', minTemp: -100, maxTemp: 100 }];
};
const { block } = genBlock('wardrobe');

const App = () => {
  const [temp, setTemp] = useState<number>(DEFAULT_TEMP);
  const [weather, setWeather] = useState('阴');
  const [weatherAvailable, setWeatherAvailable] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedOutfits, setSuggestedOutfits] = useState(() =>
    getFilteredOutfits(DEFAULT_TEMP)
  );
  const [activeTab, setActiveTab] = useState<TabType>('recommend');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
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
  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(suggestedOutfits.length - 1, i + 1));
  // 换一套看看：独立于箭头，可无限循环浏览
  const cycleNext = () => {
    if (suggestedOutfits.length <= 1) {
      setToastMessage('目前只有这一套衣服推荐');
      setTimeout(() => setToastMessage(null), 2000);
      return;
    }
    setCurrentIndex((i) => (i + 1) % suggestedOutfits.length);
  };

  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < suggestedOutfits.length - 1;
  const activeOutfit = suggestedOutfits[safeIndex];
  const outfitCounter = `${safeIndex + 1} / ${suggestedOutfits.length}`;
  const weatherLabel = useMemo(
    () => (weatherAvailable ? `${temp}°C · ${weather}` : '本地推荐'),
    [temp, weather, weatherAvailable]
  );

  useEffect(() => {
    if (!WEATHER_API_KEY) return;

    axios
      .get(
        `https://devapi.qweather.com/v7/weather/now?location=101010100&key=${WEATHER_API_KEY}`
      )
      .then((res) => {
        if (res.data.code === '200') {
          const currentTemp = Number(res.data.now.temp);
          setTemp(currentTemp);
          setWeather(res.data.now.text);
          setWeatherAvailable(true);
          setSuggestedOutfits(getFilteredOutfits(currentTemp));
        }
      })
      .catch(() => {
        setWeatherAvailable(false);
      });
  }, []);

  return (
    <div className={block()}>
      {toastMessage && (
        <div className={block('toast')} role="alert">
          {toastMessage}
        </div>
      )}
      <header className={block('header')}>
        <div>
          <p className={block('eyebrow')}>Daily Wardrobe</p>
          <h1 className={block('title')}>静静的智能衣橱</h1>
        </div>
        <div className={block('tabs')} role="tablist" aria-label="衣橱模式">
          <button
            className={`${block('tab')} ${activeTab === 'recommend' ? block('tab', 'active') : ''}`}
            onClick={() => setActiveTab('recommend')}
            aria-selected={activeTab === 'recommend'}
            role="tab"
          >
            智能推荐
          </button>
          <button
            className={`${block('tab')} ${activeTab === 'match' ? block('tab', 'active') : ''}`}
            onClick={() => setActiveTab('match')}
            aria-selected={activeTab === 'match'}
            role="tab"
          >
            自由搭配
          </button>
        </div>
      </header>

      {activeTab === 'recommend' && (
        <main className={block('recommend')}>
          <div className={block('showcase')}>
            <button
              type="button"
              className={`${block('arrow-btn')} ${block('arrow-btn', 'left')}`}
              onClick={goPrev}
              aria-label="上一套"
              disabled={!canGoPrev}
            >
              ‹
            </button>
            <div className={block('image-frame')}>
              {activeOutfit?.imageUrl ? (
                <img
                  className={block('image')}
                  src={activeOutfit.imageUrl}
                  alt={activeOutfit.name}
                />
              ) : (
                <div className={block('image-empty')}>暂无图片</div>
              )}
            </div>
            <button
              type="button"
              className={`${block('arrow-btn')} ${block('arrow-btn', 'right')}`}
              onClick={goNext}
              aria-label="下一套"
              disabled={!canGoNext}
            >
              ›
            </button>
          </div>
          <section className={block('summary')} aria-label="今日推荐">
            <div className={block('weather-strip')}>
              <span>北京</span>
              <strong>{weatherLabel}</strong>
            </div>
            <p className={block('eyebrow')}>今日推荐</p>
            <h2 className={block('outfit-name')}>{activeOutfit?.name}</h2>
            <p className={block('copy')}>
              这一套更适合今天的温度和出门节奏，利落、保暖，也不会显得太沉。
            </p>
            <div className={block('meta')}>
              <span>当前套装</span>
              <strong>{outfitCounter}</strong>
            </div>
            <button className={block('switch-btn')} onClick={cycleNext}>
              换一套看看
            </button>
          </section>
        </main>
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
