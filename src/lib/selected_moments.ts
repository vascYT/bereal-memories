import { create } from "zustand";
import type { Memories } from "~/types/bereal";

interface SelectedMomentsState {
  momentIds: string[];
  addMoment: (momentId: string, index: number) => void;
  multiAddMoment: (index: number, memories: Memories) => void;
  removeMoment: (momentId: string) => void;
  lastSelectedIndex: number | null;
}

export const useSelectedMoments = create<SelectedMomentsState>()(
  (set, get) => ({
    momentIds: [],
    addMoment: (momentId, index) =>
      set({
        momentIds: [...get().momentIds, momentId],
        lastSelectedIndex: index,
      }),
    multiAddMoment: (index, memories) => {
      const lastSelectedIndex = get().lastSelectedIndex;
      console.log(`Last selected index is ${lastSelectedIndex}`);

      if (lastSelectedIndex) {
        set({
          momentIds: memories.data
            .map((moment) => moment.momentId)
            .slice(lastSelectedIndex, index + 1),
        });
      }
    },
    removeMoment: (momentId) =>
      set({
        momentIds: get().momentIds.filter((_momentId) => _momentId != momentId),
      }),
    lastSelectedIndex: null,
  }),
);
