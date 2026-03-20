import { AdvancedCrudState } from './reducer';

interface ContextSelectors {
  isModalOpen: () => AdvancedCrudState[string];
  isPanelOpen: () => AdvancedCrudState[string];
  isBoxOpen: () => AdvancedCrudState[string];
}

const contextSelectors = (state: AdvancedCrudState): ContextSelectors => {
  return {
    isModalOpen: (): AdvancedCrudState[string] => {
      return state.isModalOpen;
    },
    isPanelOpen: (): AdvancedCrudState[string] => {
      return state.isPanelOpen;
    },
    isBoxOpen: (): AdvancedCrudState[string] => {
      return state.isBoxOpen;
    },
  };
};

export default contextSelectors;
