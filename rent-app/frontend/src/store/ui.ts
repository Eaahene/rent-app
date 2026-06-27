import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  isSidebarOpen: boolean;
  isFilterOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setFilterOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isSidebarOpen: true,
  isFilterOpen: false,

  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
}));
