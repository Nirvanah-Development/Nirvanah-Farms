import { create } from 'zustand';

export type PurchaseMode = 'group' | 'individual';

interface PurchaseModeState {
  purchaseMode: PurchaseMode;
  setPurchaseMode: (mode: PurchaseMode) => void;
}

export const usePurchaseModeStore = create<PurchaseModeState>((set) => ({
  purchaseMode: 'individual',
  setPurchaseMode: (mode) => set({ purchaseMode: mode }),
})); 