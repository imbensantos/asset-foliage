import { Product } from "@/payload-types";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const isAlreadyInCart = state.items.some(
            (item) => item.product.id === product.id,
          );

          if (isAlreadyInCart) {
            toast.error("The item is already in your cart.");
            return { items: state.items };
          }

          toast.success("Item successfully added to your cart!")
          return { items: [...state.items, { product }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
