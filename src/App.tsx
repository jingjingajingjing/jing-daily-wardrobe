import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 1. 定义衣服的类型接口
interface Outfit {
  name: string;
  minTemp: number; // 最低耐受温度
  maxTemp: number; // 最高耐受温度
}

// 2. 准备更丰富的衣橱数据
const ALL_OUTFITS: Outfit[] = [
  { name: "厚羽绒服 + 保暖内衣", minTemp: -20, maxTemp: 5 },
  { name: "羊毛大衣 + 针织衫", minTemp: 6, maxTemp: 12 },
  { name: "风衣 + 薄卫衣", minTemp: 13, maxTemp: 18 },
  { name: "简约白衬衫 + 高腰阔腿裤", minTemp: 19, maxTemp: 25 },
  { name: "碎花吊带裙 + 遮阳帽", minTemp: 26, maxTemp: 35 }
];

const App = () => {
  const [temp, setTemp] = useState<number>(5);
  const [weather, setWeather] = useState('阴');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [suggestedOutfits, setSuggestedOutfits] = useState<Outfit[]>(ALL_OUTFITS);

  useEffect(() => {
    axios.get(`https://devapi.qweather.com/v7/weather/now?location=101010100&key=你的KEY`)
      .then(res => {
        if (res.data.code === '200') {
          const currentTemp = Number(res.data.now.temp);
          setTemp(currentTemp);
          setWeather(res.data.now.text);
          const filtered = ALL_OUTFITS.filter(item => 
            currentTemp >= item.minTemp && currentTemp <= item.maxTemp
          );
          setSuggestedOutfits(filtered.length > 0 ? filtered : [{ name: "随便穿穿，心情最重要", minTemp: -100, maxTemp: 100 }]);
        }
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f4f0', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1>🌸 今天想穿啥，静静</h1>
        <p>北京当前天气：{temp}°C {weather}</p>
        <hr />
        <p>为你推荐 今日穿搭：</p>
        <p>今天心情怎么样呀!</p>
        <p>静静你穿啥都好看</p>
        <p style={{ color: '#d4a373', fontWeight: 'bold' }}>{suggestedOutfits[currentIndex]?.name}</p>
        <button 
          onClick={() => setCurrentIndex((currentIndex + 1) % suggestedOutfits.length)}
          style={{ padding: '10px 20px', borderRadius: '20px', background: '#d4a373', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          换一套看看
        </button>
      </div>
    </div>
  );
};

export default App;