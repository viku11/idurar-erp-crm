interface ProfileContextState {
  isModalOpen: boolean;
  isPanelOpen: boolean;
  [key: string]: unknown;
}

interface ProfileContextSelectors {
  isModalOpen: () => boolean;
  isPanelOpen: () => boolean;
}

const contextSelectors = (state: ProfileContextState): ProfileContextSelectors => {
  return {
    isModalOpen: () => {
      return state.isModalOpen;
    },
    isPanelOpen: () => {
      return state.isPanelOpen;
    },
  };
};

export default contextSelectors;
