
export type Mood = 'Very Happy' | 'Happy' | 'Neutral' | 'Sad' | 'Stressed' | 'Tired';

export interface User {
  name: string;
  email: string;
  photoURL: string;
}

export interface AIInsight {
  moodAnalysis: string;
  summary: string;
  advice: string;
  keywords: string[];
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  location?: string;
  description?: string;
  isLinked?: boolean;
}

export interface DiaryEntry {
  id: string;
  date: string;
  content: string;
  mood: Mood;
  images: string[];
  aiInsight?: AIInsight;
  isFavorite: boolean;
  calendarEventId?: string;
  calendarEventTitle?: string;
}

export interface DiaryState {
  entries: DiaryEntry[];
  user: User | null;
  loading: boolean;
}
