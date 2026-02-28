import React, { useState, useEffect } from 'react';
import axios from 'axios';
import greenThickCoat from './assets/images/winterCoat/greenThickCoat.jpg';
import camelColorCoat from './assets/images/autumnCoat/camelColorCoat.jpg';
import pinkFlowerSkit from './assets/images/summerSkirt/pinkFlowerSkit.jpg';

// 1. 定义衣服的类型接口
interface Outfit {
  name: string;
  minTemp: number;
  maxTemp: number;
  imageUrl?: string;
}

// 2. 准备更丰富的衣橱数据
const ALL_OUTFITS: Outfit[] = [
  {
    name: '厚羽绒服 + 保暖内衣',
    minTemp: -20,
    maxTemp: 5,
    imageUrl: greenThickCoat,
  },
  {
    name: '羊绒大衣 + 针织衫',
    minTemp: 6,
    maxTemp: 12,
    imageUrl: camelColorCoat,
  },
  {
    name: '碎花吊带裙 + 遮阳帽',
    minTemp: 26,
    maxTemp: 35,
    imageUrl: pinkFlowerSkit,
  },
];

const App = () => {
  const [temp, setTemp] = useState<number>(5);
  const [weather, setWeather] = useState('阴');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedOutfits, setSuggestedOutfits] =
    useState<Outfit[]>(ALL_OUTFITS);

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
    <div
      style={{
        textAlign: 'center',
        padding: '50px',
        backgroundColor: '#f9f4f0',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          maxWidth: '400px',
          margin: '0 auto',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        <h1>🌸 今天想穿啥，静静</h1>
        <p>
          北京当前天气：{temp}°C {weather}
        </p>
        <hr />
        <p>为你推荐 今日穿搭：</p>
        <p>今天心情怎么样呀!</p>
        <p>静静你穿啥都好看</p>
        <p style={{ color: '#d4a373', fontWeight: 'bold' }}>
          {suggestedOutfits[currentIndex]?.name}
        </p>
        <div
          style={{
            width: '100%',
            height: '360px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f6f4',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {/* 展示当前推荐衣服的图片：统一高度 + 完整展示全貌 */}
          <img
            src={suggestedOutfits[currentIndex]?.imageUrl}
            alt={suggestedOutfits[currentIndex]?.name}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '8px',
            }}
          />
        </div>
        <button
          onClick={() =>
            setCurrentIndex((currentIndex + 1) % suggestedOutfits.length)
          }
          style={{
            padding: '10px 20px',
            borderRadius: '20px',
            background: '#d4a373',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          换一套看看
        </button>
      </div>
    </div>
  );
};

export default App;
