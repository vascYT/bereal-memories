import { create } from "zustand";
import type { Post } from "./bereal";

interface PostState {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
}

export default create<PostState>()((set) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
}));
