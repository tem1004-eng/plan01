
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { DiaryEntry, Mood, CalendarEvent } from '../types';
import { MOOD_DATA } from '../constants';
import { analyzeDiaryEntry } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface EntryFormProps {
  entries?: DiaryEntry[];
  onSave: (entry: DiaryEntry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ entries, onSave }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const linkedEvent = location.state?.event as CalendarEvent | undefined;
  
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('Neutral');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (id && entries) {
      const entry = entries.find(e => e.id === id);
      if (entry) {
        setContent(entry.content);
        setMood(entry.mood);
        setIsFavorite(entry.isFavorite);
      }
    }
  }, [id, entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsAnalyzing(true);
    
    // Call Gemini for analysis
    const aiInsight = await analyzeDiaryEntry(content, mood);

    const newEntry: DiaryEntry = {
      id: id || uuidv4(),
      date: new Date().toISOString(),
      content,
      mood,
      images: [],
      isFavorite,
      aiInsight: aiInsight || undefined,
      calendarEventId: linkedEvent?.id || (id ? entries?.find(e => e.id === id)?.calendarEventId : undefined),
      calendarEventTitle: linkedEvent?.summary || (id ? entries?.find(e => e.id === id)?.calendarEventTitle : undefined)
    };

    onSave(newEntry);
    setIsAnalyzing(false);
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{id ? '기록 수정하기' : '오늘의 기록'}</h2>
          {linkedEvent ? (
            <div className="mt-2 flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 inline-flex">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              <span className="text-xs font-bold text-blue-700">{linkedEvent.summary}</span>
            </div>
          ) : (
            <p className="text-slate-500 mt-1">솔직하게 당신의 이야기를 들려주세요.</p>
          )}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-4">현재 기분은 어떠신가요?</label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {(Object.keys(MOOD_DATA) as Mood[]).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                  mood === m 
                    ? `border-blue-500 bg-blue-50 scale-105 shadow-md` 
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <span className="text-3xl mb-2">{MOOD_DATA[m].icon}</span>
                <span className={`text-[10px] font-bold ${mood === m ? 'text-blue-600' : 'text-slate-400'}`}>{m}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-bold text-slate-700 mb-2">
            {linkedEvent ? '일정에서 있었던 일을 적어주세요' : '일기 내용'}
          </label>
          <textarea
            id="content"
            rows={10}
            className="w-full p-6 rounded-[2rem] border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 leading-relaxed text-lg"
            placeholder={linkedEvent ? `${linkedEvent.summary}에 대한 당신의 생각은 어땠나요?` : "여기에 당신의 마음을 적어보세요..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsFavorite(!isFavorite)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all ${
              isFavorite ? 'bg-yellow-100 text-yellow-600' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold">{isFavorite ? '중요한 기록' : '즐겨찾기 추가'}</span>
          </button>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isAnalyzing || !content.trim()}
            className={`w-full py-5 rounded-[2rem] text-white font-black text-xl shadow-2xl transition-all flex items-center justify-center space-x-3 ${
              isAnalyzing 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-indigo-200 active:scale-95'
            }`}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span>AI가 내용을 분석중입니다...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>기록 완료</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntryForm;
