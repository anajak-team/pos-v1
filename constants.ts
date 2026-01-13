
import { Product } from './types';

export const TAX_RATE = 0; // Local markets often don't add tax on top
export const CURRENCY = '៛';

export const SEED_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Artisan Coffee',
    price: 18000,
    cost: 7200,
    category: 'Beverage',
    stock: 100,
    description: 'Rich, full-bodied roast from Ethiopian beans.',
    image: 'https://picsum.photos/200',
    barcode: '10001',
    itemsPerCase: 20
  },
  {
    id: '2',
    name: 'Croissant',
    price: 13000,
    cost: 4800,
    category: 'Food',
    stock: 25,
    description: 'Buttery, flaky pastry baked fresh daily.',
    image: 'https://picsum.photos/201',
    barcode: '10002',
    itemsPerCase: 12
  },
  {
    id: '3',
    name: 'Green Tea Latte',
    price: 20000,
    cost: 8400,
    category: 'Beverage',
    stock: 50,
    description: 'Premium matcha powder with steamed milk.',
    image: 'https://picsum.photos/202',
    barcode: '10003',
    itemsPerCase: 24
  },
  {
    id: '4',
    name: 'Avocado Toast',
    price: 48000,
    cost: 18000,
    category: 'Food',
    stock: 15,
    description: 'Sourdough bread topped with fresh avocado and spices.',
    image: 'https://picsum.photos/203',
    barcode: '10004',
    itemsPerCase: 1
  },
  {
    id: '5',
    name: 'Reusable Cup',
    price: 60000,
    cost: 20000,
    category: 'Retail',
    stock: 30,
    description: 'Eco-friendly thermal cup.',
    image: 'https://picsum.photos/204',
    barcode: '10005',
    itemsPerCase: 6
  }
];
