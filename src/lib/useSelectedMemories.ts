import { create } from "zustand";
import type { Memory } from "./bereal.ts";

interface SelectedMemoriesState {
  memoryIds: string[];
  addMemory: (memoryId: string, index: number) => void;
  multiAddMemory: (index: number, memories: Memory[]) => void;
  removeMemory: (memoryId: string) => void;
  lastSelectedIndex: number | null;
}

export const useSelectedMemories = create<SelectedMemoriesState>()(
  (set, get) => ({
    memoryIds: [],
    addMemory: (memoryId, index) =>
      set({
        memoryIds: [...get().memoryIds, memoryId],
        lastSelectedIndex: index,
      }),
    multiAddMemory: (index, memories) => {
      const lastSelectedIndex = get().lastSelectedIndex;

      if (lastSelectedIndex !== null) {
        const [start, end] =
          lastSelectedIndex <= index
            ? [lastSelectedIndex, index]
            : [index, lastSelectedIndex];

        set({
          memoryIds: memories
            .slice(start, end + 1)
            .map((memory) => memory.takenTime),
        });
      }
    },
    removeMemory: (memoryId) =>
      set({
        memoryIds: get().memoryIds.filter((_memoryId) => _memoryId != memoryId),
      }),
    lastSelectedIndex: null,
  }),
);
