import { create } from "zustand";

interface UIStore {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  isAdminSidebarCollapsed: boolean;
  activeModal: string | null;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  openSearch: () => void;
  closeSearch: () => void;

  toggleAdminSidebar: () => void;
  setAdminSidebarCollapsed: (collapsed: boolean) => void;

  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  isAdminSidebarCollapsed: false,
  activeModal: null,

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleAdminSidebar: () =>
    set((state) => ({
      isAdminSidebarCollapsed: !state.isAdminSidebarCollapsed,
    })),
  setAdminSidebarCollapsed: (collapsed) =>
    set({ isAdminSidebarCollapsed: collapsed }),

  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
