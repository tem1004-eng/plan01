
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DiaryEntry } from '../types';
import { MOOD_DATA } from '../constants';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { suggestCalendarEvent } from '../services/geminiService';

interface EntryDetailProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
  onUpdate: (entry: DiaryEntry) => void;
}

const EntryDetail: React.FC<EntryDetailProps> = ({ entries, onDelete, onUpdate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entry = entries.find(e => e.id === id);
  const [isExporting, setIsExporting] = useState(false);

  if (!entry) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">기록을 찾을 수 없습니다.</h2>
        <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">대시보드로 돌아가기</Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('정말 이 기록을 삭제하시겠습니까?')) {
      onDelete(entry.id);
      navigate('/');
    }
  };

  const toggleFavorite = () => {
    onUpdate({ ...entry, isFavorite: !entry.isFavorite });
  };

  const handleAddToCalendar = async () => {
    setIsExporting(true);
    try {
      const suggestion = await suggestCalendarEvent(entry.content);
      if (suggestion) {
        alert(`구글 캘린더에 일정이 추가되었습니다!\n\n제목: ${suggestion.summary}\n내용: ${suggestion.description}`);
        onUpdate({ ...entry, calendarEventId: 'mock-id-' + Date.now(), calendarEventTitle: suggestion.summary });
      } else {
        alert('일정 내용을 추출하지 못했습니다. 명확한 일정이 포함되어 있는지 확인해주세요.');
      }
    } catch (error) {
      alert('일정 추가 중 오류가 발생했습니다.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2.5 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-400 mb-1">
              <time>{format(new Date(entry.date), 'yyyy년 MM월 dd일 eeee', { locale: ko })}</time>
              {entry.calendarEventTitle && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">Event: {entry.calendarEventTitle}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{MOOD_DATA[entry.mood].icon}</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{entry.mood}</h2>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!entry.calendarEventId && (
            <button 
              onClick={handleAddToCalendar}
              disabled={isExporting}
              className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all font-bold text-sm"
            >
              {isExporting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z"/>
                </svg>
              )}
              <span>캘린더 등록</span>
            </button>
          )}

          <div className="w-px h-8 bg-slate-200 mx-2" />

          <button 
            onClick={toggleFavorite}
            className={`p-3.5 rounded-2xl border transition-all ${
              entry.isFavorite ? 'bg-yellow-50 border-yellow-200 text-yellow-500 shadow-lg shadow-yellow-100' : 'bg-white border-slate-200 text-slate-400 hover:text-yellow-500'
            }`}
          >
            <svg className={`w-6 h-6 ${entry.isFavorite ? 'fill-current' : 'fill-none'}`} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <Link 
            to={`/edit/${entry.id}`}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
          <button 
            onClick={handleDelete}
            className="p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[500px]">
            <p className="text-xl text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
              {entry.content}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {entry.aiInsight ? (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-200">
              <div className="flex items-center space-x-3 mb-8">
                <div className="bg-white/20 p-2.5 rounded-2xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-black text-2xl tracking-tight">AI Analysis</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Today's Essence</h4>
                  <p className="text-base font-bold leading-relaxed">{entry.aiInsight.summary}</p>
                </div>

                <div>
                  <h4 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Emotional Depth</h4>
                  <p className="text-sm font-medium leading-relaxed opacity-90">{entry.aiInsight.moodAnalysis}</p>
                </div>

                <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                   <h4 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-3 italic">Thought Prompt</h4>
                  <p className="italic text-sm font-medium leading-relaxed">"{entry.aiInsight.advice}"</p>
                </div>

                <div>
                  <h4 className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.aiInsight.keywords.map(kw => (
                      <span key={kw} className="px-3.5 py-1.5 bg-white/20 rounded-xl text-[11px] font-black tracking-wide">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-10 rounded-[2.5rem] text-slate-400 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
              <svg className="w-16 h-16 mb-6 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="font-bold text-slate-500 mb-2">No AI Insight yet</h4>
              <p className="text-xs leading-relaxed max-w-[200px] mx-auto opacity-70 mb-6">수정 버튼을 눌러 일기를 다시 저장하면 AI가 통찰을 생성해줍니다.</p>
              <Link to={`/edit/${entry.id}`} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-slate-800 transition-all">Generate Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryDetail;
