import greenThickCoat from '../assets/images/winterCoat/greenThickCoat.jpg';
import whiteFur from '../assets/images/winterCoat/whiteFur.jpg';
import camelColorCoat from '../assets/images/autumnCoat/camelColorCoat.jpg';
import brownColorCoat from '../assets/images/autumnCoat/brownColorCoat.jpg';
import pinkFlowerSkirt from '../assets/images/summerSkirt/pinkFlowerSkirt.jpg';
import creamQiaoAnNaSkirt from '../assets/images/summerSkirt/creamQiaoAnNaSkirt.jpg';
import camelWool from '../assets/images/allTrousers/camelWool.png';
import whiteStrictBrushed from '../assets/images/allTrousers/whiteStrictBrushed.png';
import camelBirkenstock from '../assets/images/allShoes/camelBirkenstock.png';
import whiteSneaker from '../assets/images/allShoes/whiteSneaker.png';

export interface Outfit {
  name: string;
  minTemp: number;
  maxTemp: number;
  imageUrl?: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  imageUrl: string;
  category: 'coat' | 'trousers' | 'skirt' | 'shoes';
}

export const ALL_OUTFITS: Outfit[] = [
  { name: '绿色无帽厚羽绒服', minTemp: -15, maxTemp: -5, imageUrl: greenThickCoat },
  { name: '白色无帽厚皮草', minTemp: -15, maxTemp: -5, imageUrl: whiteFur },
  { name: '棕色羊绒大衣', minTemp: -4, maxTemp: 3, imageUrl: brownColorCoat },
  { name: '驼色羊绒大衣', minTemp: 4, maxTemp: 12, imageUrl: camelColorCoat },
  { name: '嫩粉色碎花真丝长裙', minTemp: 25, maxTemp: 35, imageUrl: pinkFlowerSkirt },
  { name: '米色乔安娜长裙', minTemp: 25, maxTemp: 35, imageUrl: creamQiaoAnNaSkirt },
];

export const CLOTHING_ITEMS: ClothingItem[] = [
  { id: 'coat-1', name: '绿色厚羽绒服', imageUrl: greenThickCoat, category: 'coat' },
  { id: 'coat-2', name: '白色皮草', imageUrl: whiteFur, category: 'coat' },
  { id: 'coat-3', name: '棕色羊绒大衣', imageUrl: brownColorCoat, category: 'coat' },
  { id: 'coat-4', name: '驼色羊绒大衣', imageUrl: camelColorCoat, category: 'coat' },
  { id: 'skirt-1', name: '嫩粉色碎花长裙', imageUrl: pinkFlowerSkirt, category: 'skirt' },
  { id: 'skirt-2', name: '米色乔安娜长裙', imageUrl: creamQiaoAnNaSkirt, category: 'skirt' },
  { id: 'trousers-1', name: '驼色羊毛裤', imageUrl: camelWool, category: 'trousers' },
  { id: 'trousers-2', name: '白色直筒刷毛裤', imageUrl: whiteStrictBrushed, category: 'trousers' },
  { id: 'shoes-1', name: '驼色勃肯鞋', imageUrl: camelBirkenstock, category: 'shoes' },
  { id: 'shoes-2', name: '白色运动鞋', imageUrl: whiteSneaker, category: 'shoes' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  coat: '外套',
  trousers: '裤子',
  skirt: '裙子',
  shoes: '鞋子',
};
