import greenThickCoat from '../assets/images/winterCoat/greenThickCoat.jpg';
import whiteFur from '../assets/images/winterCoat/whiteFur.jpg';
import camelColorCoat from '../assets/images/autumnCoat/camelColorCoat.jpg';
import brownColorCoat from '../assets/images/autumnCoat/brownColorCoat.jpg';
import pinkFlowerSkirt from '../assets/images/summerSkirt/pinkFlowerSkirt.jpg';
import creamQiaoAnNaSkirt from '../assets/images/summerSkirt/creamQiaoAnNaSkirt.jpg';

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
  category: 'coat' | 'bottom' | 'shoes';
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
  { id: 'bottom-1', name: '嫩粉色碎花长裙', imageUrl: pinkFlowerSkirt, category: 'bottom' },
  { id: 'bottom-2', name: '米色乔安娜长裙', imageUrl: creamQiaoAnNaSkirt, category: 'bottom' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  coat: '外套',
  bottom: '下装',
  shoes: '鞋子',
};
