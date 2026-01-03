export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'video' | 'article' | 'book' | 'course';
  rating: number;
  votes: number;
  tags: string[];
}

export interface Summary {
  id: string;
  originalText: string;
  summaryText: string;
  createdAt: number;
  title: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  collaborators: string[];
  lastUpdated: number;
}

export enum ViewState {
  HOME = 'HOME',
  SUMMARY = 'SUMMARY',
  NOTES = 'NOTES',
  RESOURCES = 'RESOURCES',
  PROFILE = 'PROFILE'
}