import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useTokenStore = create(
  persist(
    (set) => ({
      accessToken: '',
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
    }),
    {
      name: 'tokens',
    }
  )
);

export const useEmailStore = create(
  persist(
    (set) => ({
      email: '',
      setEmail: (email) => set((state) => ({ email })),
    }),
    {
      name: 'email',
    }
  )
);
