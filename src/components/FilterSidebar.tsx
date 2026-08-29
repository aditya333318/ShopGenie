import React from 'react';
import { SlidersHorizontal, RotateCcw, Star, Truck, Check } from 'lucide-react';
import { FilterState, Product } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  categories: string[];
  products: Product[];
  onResetFilters: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  categories,
  products,
  onResetFilters,
}) => {
  return (
    <aside className="w-full lg:w-64 bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-6 h-fit shrink-0">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#1A73E8]" />
          <h3 className="font-bold text-sm text-[#202124]">Filter & Refine</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] text-slate-400 hover:text-[#1A73E8] flex items-center gap-1 font-medium transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
          className="w-full px-3 py-2 bg-[#F8F9FA] border border-slate-200 text-xs font-medium text-[#202124] rounded-xl focus:outline-none focus:border-[#1A73E8]"
          id="sort-by-select"
        >
          <option value="featured">Featured Picks</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="discount">Biggest Discount</option>
        </select>
      </div>

      {/* Category List */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ ...filters, category: 'All' })}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
              filters.category === 'All'
                ? 'bg-[#202124] text-white font-bold'
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-75">{products.length}</span>
          </button>
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => onFilterChange({ ...filters, category: cat })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                  filters.category === cat
                    ? 'bg-[#1A73E8] text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Max Price Range Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider">Max Price</span>
          <span className="font-extrabold text-[#1A73E8]">${filters.maxPrice}</span>
        </div>
        <input
          type="range"
          min="50"
          max="1000"
          step="25"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#1A73E8] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>$50</span>
          <span>$500</span>
          <span>$1000</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Minimum Rating
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 4.5, 4.8].map((rating) => (
            <button
              key={rating}
              onClick={() => onFilterChange({ ...filters, minRating: rating })}
              className={`py-1.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border transition-colors ${
                filters.minRating === rating
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Perks & Availability
        </label>
        <div className="space-y-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={filters.fastShippingOnly}
              onChange={(e) => onFilterChange({ ...filters, fastShippingOnly: e.target.checked })}
              className="rounded text-[#1A73E8] focus:ring-[#1A73E8] accent-[#1A73E8]"
            />
            <span className="flex items-center gap-1 font-medium">
              <Truck className="w-3.5 h-3.5 text-[#1A73E8]" />
              Express Delivery Only
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="rounded text-[#1A73E8] focus:ring-[#1A73E8] accent-[#1A73E8]"
            />
            <span className="flex items-center gap-1 font-medium">
              <Check className="w-3.5 h-3.5 text-[#1E8E3E]" />
              In Stock Only
            </span>
          </label>
        </div>
      </div>

    </aside>
  );
};
