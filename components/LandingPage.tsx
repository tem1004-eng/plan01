
import React from 'react';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-12 md:p-20 flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Lumina</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              가장 프라이빗한 공간에서 당신의 오늘을 기록하고,<br /> 
              AI의 따뜻한 공감을 경험해보세요.
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onLogin}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              <span className="font-bold text-slate-700">Google 계정으로 시작하기</span>
            </button>
            <p className="text-center text-[10px] text-slate-400">시작함으로써 서비스 약관 및 개인정보 처리방침에 동의하게 됩니다.</p>
          </div>
        </div>

        <div className="hidden md:block bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative">
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="space-y-6 text-white text-center">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-3xl mx-auto flex items-center justify-center text-5xl mb-8 border border-white/20">
                ✨
              </div>
              <h2 className="text-3xl font-bold">당신만을 위한 AI 도슨트</h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-xs mx-auto">
                일기를 적는 것만으로도 충분합니다. Lumina AI가 당신의 감정 흐름을 분석하고 맞춤형 인사이트를 제공합니다.
              </p>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
