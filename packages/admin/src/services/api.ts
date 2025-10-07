import axios, { AxiosInstance } from 'axios';
import { SearchQuery, SearchResult, Seller, InventoryItem, ApiResponse } from '@local-tcg/shared';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Search methods
  async searchInventory(query: SearchQuery): Promise<SearchResult> {
    const response = await this.client.get<ApiResponse<SearchResult>>('/search', {
      params: query,
    });
    return response.data.data!;
  }

  async searchNearbySellers(
    latitude: number,
    longitude: number,
    radiusMiles?: number,
    type?: string
  ): Promise<Seller[]> {
    const response = await this.client.get<ApiResponse<{ items: Seller[] }>>('/search/sellers', {
      params: { latitude, longitude, radiusMiles, type },
    });
    return response.data.data!.items;
  }

  // Inventory methods
  async getInventory(filters?: {
    sellerId?: string;
    cardName?: string;
    limit?: number;
    offset?: number;
  }): Promise<InventoryItem[]> {
    const response = await this.client.get<ApiResponse<InventoryItem[]>>('/inventory', {
      params: filters,
    });
    return response.data.data!;
  }

  async getInventoryItem(id: string): Promise<InventoryItem> {
    const response = await this.client.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
    return response.data.data!;
  }

  // Seller methods
  async getSellers(filters?: {
    type?: string;
    city?: string;
    state?: string;
    limit?: number;
    offset?: number;
  }): Promise<Seller[]> {
    const response = await this.client.get<ApiResponse<Seller[]>>('/sellers', {
      params: filters,
    });
    return response.data.data!;
  }

  async getSeller(id: string): Promise<Seller> {
    const response = await this.client.get<ApiResponse<Seller>>(`/sellers/${id}`);
    return response.data.data!;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
