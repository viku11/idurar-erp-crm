import { CrudContextState } from './reducer';

interface CrudContextSelectors {
  isModalOpen: () => boolean;
  isPanelOpen: () => boolean;
  isBoxOpen: () => boolean;
}

const contextSelectors = (state: CrudContextState): CrudContextSelectors => {
  return {
    isModalOpen: () => {
      return state.isModalOpen;
    },
    isPanelOpen: () => {
      return (state as unknown as Record<string, unknown>).isPanelOpen as boolean;
    },
    isBoxOpen: () => {
      return (state as unknown as Record<string, unknown>).isBoxOpen as boolean;
    },
  };
};

export default contextSelectors;
