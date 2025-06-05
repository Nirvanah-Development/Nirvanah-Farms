import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from "@/sanity.types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  groupedItems: Record<string, CartItem[]>;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  resetCart: () => void;
  version: number;
}

// Migration function to handle old cart data
const migrateCartData = (persistedState: any, version: number) => {
  // If no version or old version, reset the cart
  if (!persistedState?.version || persistedState.version < 2) {
    return {
      items: [],
      groupedItems: {},
      version: 2,
    };
  }
  return persistedState;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      groupedItems: {},
      version: 2,
      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.product._id === item.product._id
          );

          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.product._id === item.product._id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }

          return { items: [...state.items, item] };
        });

        // Update grouped items
        const items = get().items;
        const grouped = items.reduce((acc, item) => {
          const storeId = 'default-store'; // Since products don't have store field in the Product type
          if (!acc[storeId]) {
            acc[storeId] = [];
          }
          acc[storeId].push(item);
          return acc;
        }, {} as Record<string, CartItem[]>);

        set({ groupedItems: grouped });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }));

        // Update grouped items
        const items = get().items;
        const grouped = items.reduce((acc, item) => {
          const storeId = 'default-store';
          if (!acc[storeId]) {
            acc[storeId] = [];
          }
          acc[storeId].push(item);
          return acc;
        }, {} as Record<string, CartItem[]>);

        set({ groupedItems: grouped });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          set((state) => ({
            items: state.items.filter((item) => item.product._id !== productId),
          }));
        } else {
          set((state) => ({
            items: state.items.map((item) =>
              item.product._id === productId ? { ...item, quantity } : item
            ),
          }));
        }

        // Update grouped items
        const items = get().items;
        const grouped = items.reduce((acc, item) => {
          const storeId = 'default-store';
          if (!acc[storeId]) {
            acc[storeId] = [];
          }
          acc[storeId].push(item);
          return acc;
        }, {} as Record<string, CartItem[]>);

        set({ groupedItems: grouped });
      },
      resetCart: () => {
        set({ items: [], groupedItems: {} });
      },
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: migrateCartData,
    }
  )
); 