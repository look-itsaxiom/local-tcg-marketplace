// Core types for the TCG marketplace

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Card {
  id: string;
  name: string;
  set: string;
  setCode: string;
  number: string;
  rarity: string;
  condition: CardCondition;
  foil: boolean;
  language: string;
  imageUrl?: string;
  tcgplayerId?: string;
  scryfallId?: string;
}

export enum CardCondition {
  MINT = 'MINT',
  NEAR_MINT = 'NEAR_MINT',
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  LIGHT_PLAYED = 'LIGHT_PLAYED',
  PLAYED = 'PLAYED',
  POOR = 'POOR',
}

export interface InventoryItem {
  id: string;
  cardId: string;
  card: Card;
  sellerId: string;
  seller: Seller;
  quantity: number;
  price: number;
  condition: CardCondition;
  foil: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SellerType {
  STORE = 'STORE',
  INDIVIDUAL = 'INDIVIDUAL',
}

export interface Seller {
  id: string;
  name: string;
  type: SellerType;
  location: Location;
  email: string;
  phone?: string;
  website?: string;
  pickupHours?: string;
  rating?: number;
  totalSales?: number;
  posSystemType?: POSSystemType;
  createdAt: Date;
  updatedAt: Date;
}

export enum POSSystemType {
  SQUARE = 'SQUARE',
  SHOPIFY = 'SHOPIFY',
  CRYSTAL_COMMERCE = 'CRYSTAL_COMMERCE',
  BINDING_EDGE = 'BINDING_EDGE',
  TCGPLAYER = 'TCGPLAYER',
  CUSTOM = 'CUSTOM',
}

export interface SearchQuery {
  cardName?: string;
  setName?: string;
  condition?: CardCondition[];
  foilOnly?: boolean;
  maxPrice?: number;
  minPrice?: number;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  sellerType?: SellerType[];
  sortBy?: 'price' | 'distance' | 'condition';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  items: InventoryItem[];
  total: number;
  hasMore: boolean;
}

export interface POSIntegration {
  id: string;
  sellerId: string;
  systemType: POSSystemType;
  apiKey: string;
  apiSecret?: string;
  storeId?: string;
  enabled: boolean;
  lastSyncedAt?: Date;
  createdAt: Date;
}

export interface SyncLog {
  id: string;
  integrationId: string;
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS';
  itemsSynced?: number;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
