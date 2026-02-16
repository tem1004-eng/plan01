
import React from 'react';
import { Mood } from './types';

export const MOOD_DATA: Record<Mood, { icon: string; color: string; bg: string }> = {
  'Very Happy': { icon: '✨', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  'Happy': { icon: '😊', color: 'text-green-600', bg: 'bg-green-100' },
  'Neutral': { icon: '😐', color: 'text-blue-600', bg: 'bg-blue-100' },
  'Sad': { icon: '😢', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  'Stressed': { icon: '😫', color: 'text-red-600', bg: 'bg-red-100' },
  'Tired': { icon: '😴', color: 'text-slate-600', bg: 'bg-slate-100' },
};

export const MOCK_USER = {
  name: "김민준",
  email: "minjun.kim@example.com",
  photoURL: "https://picsum.photos/seed/user123/200/200"
};
