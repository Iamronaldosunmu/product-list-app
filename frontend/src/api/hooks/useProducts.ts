import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createProduct, deleteProduct, fetchProducts, fetchProductsByUser, ProductData, updateProduct } from '../productApi';

export const useProducts = (searchTerm?: string, category?: string) => {
  return useQuery<{products: ProductData[]}, Error>({
    queryKey: ['products', { name: searchTerm, category }],
    // @ts-expect-error quick fix
    queryFn: fetchProducts,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] }); 
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductData) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['userProducts'] }); 
    },
  });
};

export const useDeleteProduct = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProducts'] });
    },
  });
};

export const useUserProducts = () => {
  return useQuery<ProductData[], Error>({
    queryKey: ['userProducts'],
    queryFn: fetchProductsByUser,
  });
};