interface ErpContextState {
  isModalOpen: boolean;
  isPanelOpen: boolean;
  isBoxOpen: boolean;
}

interface ErpContextSelectors {
  isModalOpen: () => boolean;
  isPanelOpen: () => boolean;
  isBoxOpen: () => boolean;
}

const contextSelectors = (state: ErpContextState): ErpContextSelectors => {
  return {
    isModalOpen: (): boolean => {
      return state.isModalOpen;
    },
    isPanelOpen: (): boolean => {
      return state.isPanelOpen;
    },
    isBoxOpen: (): boolean => {
      return state.isBoxOpen;
    },
  };
};

export default contextSelectors;
