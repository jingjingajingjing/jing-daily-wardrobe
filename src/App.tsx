import React, { useState, useEffect } from 'react';
import axios from 'axios';
import greenThickCoat from './assets/images/winterCoat/greenThickCoat.jpg';
import whiteFur from './assets/images/winterCoat/whiteFur.jpg';
import camelColorCoat from './assets/images/autumnCoat/camelColorCoat.jpg';
import brownColorCoat from './assets/images/autumnCoat/brownColorCoat.jpg';
import pinkFlowerSkit from './assets/images/summerSkirt/pinkFlowerSkirt.jpg';
import creamQiaoAnNaSkirt from './assets/images/summerSkirt/creamQiaoAnNaSkirt.jpg';
import { genBlock } from './utils/bem';
import './App.less';
const { block } = genBlock('wardrobe');

interface Outfit {
  name: string;
  minTemp: number;
  maxTemp: number;
  imageUrl?: string;
}

const ALL_OUTFITS: Outfit[] = [
  {
    name: '绿色无帽厚羽绒服',
    minTemp: -15,
    maxTemp: -5,
    imageUrl: greenThickCoat,
  },
  {
    name: '白色无帽厚皮草',
    minTemp: -15,
    maxTemp: -5,
    imageUrl: whiteFur,
  },
  {
    name: '棕色羊绒大衣',
    minTemp: -4,
    maxTemp: 3,
    imageUrl: brownColorCoat,
  },
  {
    name: '驼色羊绒大衣',
    minTemp: 4,
    maxTemp: 12,
    imageUrl: camelColorCoat,
  },
  {
    name: '嫩粉色碎花真丝长裙',
    minTemp: 25,
    maxTemp: 35,
    imageUrl: pinkFlowerSkit,
  },
  {
    name: '米色乔安娜长裙',
    minTemp: 25,
    maxTemp: 35,
    imageUrl: creamQiaoAnNaSkirt,
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
    <div className={block()}>
      <div className={block('card')}>
        <h1>🌸 今天想穿啥，静静</h1>
        <p>
          北京当前天气：{temp}°C {weather}
        </p>
        <hr />
        <p>为你推荐 今日穿搭：</p>
        <p>今天心情怎么样呀!</p>
        <p>静静你穿啥都好看</p>
        <p className={block('outfit-name')}>{suggestedOutfits[currentIndex]?.name}</p>
        <div className={block('image-wrapper')}>
          <img
            className={block('image')}
            src={suggestedOutfits[currentIndex]?.imageUrl}
            alt={suggestedOutfits[currentIndex]?.name}
          />
        </div>
        <button
          className={block('switch-btn')}
          onClick={() =>
            setCurrentIndex((currentIndex + 1) % suggestedOutfits.length)
          }
        >
          换一套看看
        </button>
      </div>
    </div>
  );
};

export default App;
