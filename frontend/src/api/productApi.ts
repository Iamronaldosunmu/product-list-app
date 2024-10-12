import { apiClient } from './apiClient';

export interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
}

export interface Product extends ProductData{
  _id: string
}

// export const fetchProducts = async (): Promise<ProductData[]> => {
//   const response = await apiClient.get<ProductData[]>('/products');
//   return response.data;
// };
export const fetchProducts = async ({ queryKey }: any): Promise<ProductData[]> => {
  const [_key, { name, category }] = queryKey;

  const response = await apiClient.get('/products', {
    params: {
      name: name || '',
      category: category || '',
    },
  });

  return response.data;
};

export const createProduct = async (data: ProductData): Promise<ProductData> => {
  const response = await apiClient.post<ProductData>('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: ProductData): Promise<ProductData> => {
  const response = await apiClient.put<ProductData>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};
