export interface Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  inStock: boolean;
  stockCount?: number;
  fastShipping: boolean;
  tags: string[];
  pros: string[];
  cons: string[];
  userReviews: {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    verified: boolean;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface AgentThoughtStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'done';
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  recommendedProductIds?: string[];
  comparisonProductIds?: string[];
  thoughtSteps?: AgentThoughtStep[];
  dealCodeSuggestion?: string;
  suggestedPrompts?: string[];
  visualImageAnalysis?: {
    identifiedItem: string;
    attributes: string[];
    priceRange: string;
  };
}

export interface ShoppingMission {
  id: string;
  title: string;
  prompt: string;
  icon: string;
  category: string;
  budget?: number;
  badgeText?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  fastShippingOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount';
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  description: string;
}
