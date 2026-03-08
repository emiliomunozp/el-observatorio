import { create } from 'zustand';

const useStore = create((set) => ({
  userProfile: null, // null | 'creative' | 'technical'
  currentScrollScene: 0,
  liveDataStatus: 'loading', // 'loading' | 'success' | 'error'

  setUserProfile: (profile) => set({ userProfile: profile }),
  setCurrentScrollScene: (scene) => set({ currentScrollScene: scene }),
  setLiveDataStatus: (status) => set({ liveDataStatus: status }),
}));

export default useStore;
