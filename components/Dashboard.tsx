
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DiaryEntry, Mood, CalendarEvent } from '../types';
import { MOOD_DATA } from '../constants';
import { format, startOfToday, addDays, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DashboardProps {
  entries: DiaryEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const navigate = useNavigate();
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(startOfToday());

  useEffect(() => {
    // Simulated Google Calendar Events for the current week
    const today = startOfToday();
    const mockEvents: CalendarEvent[] = [
      { id: 'ev1', summary: '주간 디자인 회의', start: new Date(today.setHours(10, 0)).toISOString(), location: 'Zoom', description: '새로운 UI 컴포넌트 리뷰' },
      { id: 'ev2', summary: '친구들과 점심 약속', start: new Date(today.setHours(12, 30)).toISOString(), location: '강남구 신사동' },
      { id: 'ev3', summary: 'Gemini API 통합 작업', start: new Date(today.setHours(15, 0)).toISOString(), description: '일기 분석 모듈 고도화' },
      { id: 'ev4', summary: '헬스장 운동', start: new Date(addDays(today, 1).setHours(19, 0)).toISOString(), location: '스포짐' },
      { id: 'ev5', summary: '가족 저녁 식사', start: new Date(addDays(today, -1).setHours(18, 0)).toISOString(), location: '한정식집' },
    ];
    setCalendarEvents(mockEvents);
  }, []);

  const weekDays = useMemo(() => {
    const today = startOfToday();
    return Array.from({ length: 7 }, (_, i) => addDays(today, i - 3));
  }, []);

  const filteredEvents = useMemo(() => {
    return calendarEvents
      .filter(ev => isSameDay(new Date(ev.start), selectedDay))
      .sort((a, b) => new Date(a.start).getTime() - b.start).getTime();
  }, [calendarEvents, selectedDay]);

  const getEntryForEvent = (eventId: string) => {
    return entries.find(e => e.calendarEventId === eventId);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Timeline</h2>
          <p className="text-slate-500 mt-2 font-medium">당신의 일정을 따라 기록을 남겨보세요.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
          {weekDays.map((day, idx) => {
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, startOfToday());
            return (
              <button
                key={idx}
                onClick={() => setSelectedDay(day)}
                className={`flex flex-col items-center min-w-[64px] py-3 rounded-xl transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-1">{format(day, 'EEE', { locale: ko })}</span>
                <span className="text-lg font-black">{format(day, 'd')}</span>
                {isToday && !isSelected && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1" />}
              </button>
            );
          })}
        </div>
      </header>

      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px] flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2.5 rounded-2xl shadow-lg shadow-blue-100">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {format(selectedDay, 'yyyy년 MM월 dd일', { locale: ko })}
              </h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Google Calendar Events</p>
            </div>
          </div>
          <Link 
            to="/new"
            className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
          >
            일반 일기 쓰기
          </Link>
        </div>

        <div className="flex-1 p-8 space-y-12 relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-slate-100" />

          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl grayscale opacity-50">📅</div>
              <div>
                <h4 className="text-lg font-bold text-slate-400">오늘은 일정이 없네요.</h4>
                <p className="text-sm text-slate-400">자유롭게 오늘의 생각을 남겨보세요.</p>
              </div>
              <Link to="/new" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all">첫 일기 작성</Link>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const entry = getEntryForEvent(event.id);
              return (
                <div key={event.id} className="relative pl-16 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[-2px] top-4 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125 ${entry ? 'bg-blue-600' : 'bg-slate-300'}`} />
                  
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-black text-slate-400">
                          {format(new Date(event.start), 'HH:mm')}
                        </span>
                        <h4 className="text-xl font-bold text-slate-900">{event.summary}</h4>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs text-slate-500 space-x-1 font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.description && <p className="text-sm text-slate-400 line-clamp-1">{event.description}</p>}
                    </div>

                    {/* Associated Diary Card */}
                    <div className="lg:w-80 shrink-0">
                      {entry ? (
                        <Link 
                          to={`/entry/${entry.id}`}
                          className="block p-5 bg-white rounded-3xl border-2 border-blue-50 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group/card relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                            <span className="text-blue-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mb-3">
                            <span className={`text-xl p-1.5 rounded-xl ${MOOD_DATA[entry.mood].bg}`}>
                              {MOOD_DATA[entry.mood].icon}
                            </span>
                            <span className="text-xs font-bold text-blue-600">{entry.mood}</span>
                          </div>
                          <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed italic">
                            "{entry.content.substring(0, 100)}..."
                          </p>
                        </Link>
                      ) : (
                        <button
                          onClick={() => navigate('/new', { state: { event } })}
                          className="w-full h-full p-6 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all flex flex-col items-center justify-center space-y-2 group/btn"
                        >
                          <svg className="w-8 h-8 opacity-40 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm font-bold">일기 쓰기</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Quick Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200">
          <h4 className="text-indigo-200 text-xs font-black uppercase tracking-widest mb-4">Sentiment Trend</h4>
          <div className="flex items-end space-x-2 h-20 mb-4">
            {[40, 70, 45, 90, 65, 85, 30].map((h, i) => (
              <div key={i} className="flex-1 bg-white/20 rounded-t-lg transition-all hover:bg-white/40" style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-sm font-medium">지난 7일 동안 <span className="text-yellow-300 font-bold">행복함</span> 지수가 20% 상승했습니다!</p>
        </div>

        <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 flex flex-col justify-center">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-50 p-6 rounded-3xl">
              <span className="text-4xl">✍️</span>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-slate-900">연속 기록 5일째</h4>
              <p className="text-slate-500 font-medium">당신만의 소중한 데이터가 쌓이고 있어요. 오늘도 훌륭합니다!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
