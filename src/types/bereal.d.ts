/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Memories {
  data: MemoriesData[];
  memoriesSynchronized: boolean;
}

export interface Moment {
  memoryDay: string;
  posts: Post[];
}

export interface MemoriesData {
  memoryDay: string;
  momentId: string;
  mainPostMemoryId: string;
  mainPostThumbnail: MainPostThumbnail;
  mainPostPrimaryMedia: MainPostPrimaryMedia;
  mainPostSecondaryMedia: MainPostSecondaryMedia;
  mainPostTakenAt: string;
  isLate: boolean;
  numPostsForMoment: number;
}

export interface MainPostThumbnail {
  url: string;
  width: number;
  height: number;
  mediaType: string;
}

export interface MainPostPrimaryMedia {
  url: string;
  width: number;
  height: number;
  mediaType?: string;
}

export interface MainPostSecondaryMedia {
  url: string;
  width: number;
  height: number;
  mediaType?: string;
}

export interface Post {
  id: string;
  isLate: boolean;
  isMain: boolean;
  primary: Primary;
  secondary: Secondary;
  thumbnail: Thumbnail;
  takenAt: string;
  postedAt: string;
  comments: any[];
  realmojis: Realmoji[];
  numRealmojis: number;
  tags: any[];
  postType: string;
}

export interface Primary {
  url: string;
  width: number;
  height: number;
  mediaType: string;
}

export interface Secondary {
  url: string;
  width: number;
  height: number;
  mediaType: string;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
  mediaType: string;
}

export interface Realmoji {
  id: string;
  emoji: string;
  isInstant: boolean;
  postedAt: string;
  userId: string;
  user: User;
  media: Media;
}

export interface User {
  id: string;
  username: string;
  type: string;
}

export interface Media {
  url: string;
  width: number;
  height: number;
}
