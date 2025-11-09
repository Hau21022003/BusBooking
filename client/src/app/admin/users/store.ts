import { Account } from "@/types/account.type";
import { create } from "zustand";

type UsersStore = {
  isSaveOpen: boolean;
  selectedUser?: Account;
  openSaveUser: (user?: Account) => void;
  closeSaveUser: () => void;
};

export const useUserStore = create<UsersStore>()((set, get) => ({
  isSaveOpen: false,
  openSaveUser: (user) => set({ isSaveOpen: true, selectedUser: user }),
  closeSaveUser: () => set({ isSaveOpen: false, selectedUser: undefined }),
}));
