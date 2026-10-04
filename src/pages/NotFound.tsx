import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 text-indigo-400 flex items-center justify-center mx-auto shadow-xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-white font-['Syne',sans-serif]">404 - Piece Not Found</h1>
        <p className="text-sm text-neutral-400">
          The garment or page you were looking for doesn&apos;t exist or has been archived from the collection.
        </p>
        <button
          onClick={onGoHome}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </button>
      </div>
    </div>
  );
};
