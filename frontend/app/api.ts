const API_URL = 'http://localhost:3001/api';

export interface Assignment {
  baureihe: string;
  modelle: string[];
}

export interface Variant {
  code: string; // "01", "02", etc.
  assignments: Assignment[];
}

export interface Product {
  _id: string;
  name: string;
  code: string;
  variants: Variant[];
  createdAt: string;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  async createProduct(name: string): Promise<Product> {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    return res.json();
  },

  async createVariant(productId: string, assignments: Assignment[]): Promise<Product> {
    const res = await fetch(`${API_URL}/products/${productId}/variants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignments }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create variant');
    }
    return res.json();
  }
};