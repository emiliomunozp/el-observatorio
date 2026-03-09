import { create } from 'zustand';

const useStore = create((set) => ({
    profile: null,
    setProfile: (profile) => set({ profile }),

    currentScrollScene: 0,
    setCurrentScrollScene: (scene) => set({ currentScrollScene: scene }),

    liveDataStatus: 'loading', // 'loading' | 'success' | 'error'
    setLiveDataStatus: (status) => set({ liveDataStatus: status }),

    metrics: { illiteracy: 95, incubatorNonUsage: 87.2 },
    setMetrics: (newMetrics) => set({ metrics: newMetrics })
}));

export default useStore;
