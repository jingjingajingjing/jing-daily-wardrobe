import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [temp, setTemp] = useState('--');
  const [weather, setWeather] = useState('加载中...');
  const [currentIndex, setCurrentIndex] = useState(0);

  const outfits = [
    "今天穿件漂亮的毛衣吧 + 浅色牛仔裤",
    "简约白衬衫 + 高腰阔腿裤",
    "针织开衫 + 碎花半身裙"
  ];

  useEffect(() => {
    // 自动获取天气
    axios.get(`https://devapi.qweather.com/v7/weather/now?location=101010100&key=00d760eeb9774ac483b08c60c048ac17`)
      .then(res => {
        if (res.data.code === '200') {
          setTemp(res.data.now.temp);
          setWeather(res.data.now.text);
        }
      });
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f9f4f0', minHeight: '100vh' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '400px', margin: '0 auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1>🌸 今天想穿啥，静静</h1>
        <p>北京当前天气：{temp}°C {weather}</p>
        <hr />
        <p>为你推荐：</p>
        <p style={{ color: '#d4a373', fontWeight: 'bold' }}>{outfits[currentIndex]}</p>
        <button 
          onClick={() => setCurrentIndex((currentIndex + 1) % outfits.length)}
          style={{ padding: '10px 20px', borderRadius: '20px', background: '#d4a373', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          换一套看看
        </button>
      </div>
    </div>
  );
};

export default App;