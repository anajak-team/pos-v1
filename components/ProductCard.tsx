
import React from 'react';
import { Product } from '../types';
import { Plus, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  currency: string;
  showStockLevel?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, currency, showStockLevel = true }) => {
  return (
    <div 
      className="bg-white/30 dark:bg-slate-900/40 backdrop-blur-xl rounded-xl shadow-sm border border-white/40 dark:border-white/10 overflow-hidden flex flex-col active:scale-95 transition-all duration-200 touch-manipulation cursor-pointer h-full group hover:bg-white/40 dark:hover:bg-slate-900/50 relative"
      onClick={() => onAdd(product)}
    >
      {/* Mobile: Super Compact Image (h-24), Tablet/Desktop: Standard Compact (h-28) */}
      <div className="h-24 sm:h-28 relative overflow-hidden p-1.5 shrink-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover rounded-lg shadow-sm transform group-hover:scale-105 transition-transform duration-500 bg-white/10"
          loading="lazy"
        />
        <div className="absolute bottom-2.5 right-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-1 rounded-md shadow-sm border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus size={14} className="text-primary" />
        </div>
      </div>
      <div className="px-2 pb-2 pt-0 flex flex-col flex-1 min-w-0">
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-xs sm:text-sm leading-tight">{product.name}</h3>
            <p className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 font-medium leading-relaxed opacity-80">{product.description}</p>
        </div>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
            {currency}{product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {showStockLevel && (
            <div className={`text-[10px] flex items-center gap-1 font-bold px-1.5 py-0.5 rounded-md ${product.stock <= 5 ? 'text-red-600 bg-red-100/50 dark:text-red-400 dark:bg-red-900/30' : 'text-slate-500 bg-slate-100/50 dark:text-slate-400 dark:bg-slate-800/50'}`}>
               <Package size={10} strokeWidth={2.5} />
               {product.stock}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
