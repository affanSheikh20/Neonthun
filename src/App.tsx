import React, { useState } from 'react';
import { Download, Search, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const extractVideoID = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleGetThumbnail = () => {
    setError(null);
    setThumbnailUrl(null);
    
    if (!url.trim()) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate a tiny delay for premium feel
    setTimeout(() => {
      const videoId = extractVideoID(url);
      if (videoId) {
        setThumbnailUrl(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      } else {
        setError('Invalid YouTube link. Please check and try again.');
      }
      setIsLoading(false);
    }, 400);
  };

  const handleDownload = async () => {
    if (!thumbnailUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(thumbnailUrl)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
      const a = document.createElement('a');
      a.href = thumbnailUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-white/20">
      {/* Premium Atmospheric Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-4xl z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/40 font-semibold mb-6">
            High-Resolution Asset Recovery
          </p>
          <h1 className="text-5xl md:text-7xl font-light tracking-tighter mb-6">
            Frame <span className="text-white/30 italic">Extractor</span>
          </h1>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl"
        >
          <div className="relative group flex items-center bg-white/[0.03] border border-white/10 rounded-full p-2 backdrop-blur-2xl transition-all duration-500 focus-within:bg-white/[0.05] focus-within:border-white/20 focus-within:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
            <div className="pl-6 pr-3 text-white/30 group-focus-within:text-white/70 transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGetThumbnail()}
              placeholder="Paste YouTube link..."
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 text-lg font-light px-2 w-full"
            />
            <button
              onClick={handleGetThumbnail}
              disabled={isLoading}
              className="bg-white text-black rounded-full px-8 py-4 font-medium flex items-center gap-2 hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? 'Extracting...' : 'Extract'} 
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, mt: 0 }}
                animate={{ opacity: 1, height: 'auto', mt: 16 }}
                exit={{ opacity: 0, height: 0, mt: 0 }}
                className="flex items-center justify-center gap-2 text-red-400/80 text-sm font-medium overflow-hidden"
              >
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Result Section */}
        <AnimatePresence>
          {thumbnailUrl && !error && (
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="w-full mt-16"
            >
              <div className="relative p-2 md:p-3 rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-3xl shadow-2xl group">
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-video bg-black/50">
                  <img
                    src={thumbnailUrl}
                    alt="Extracted Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 backdrop-blur-md font-medium py-4 px-8 rounded-full flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDownloading ? (
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="h-5 w-5" />
                      )}
                      {isDownloading ? 'Downloading...' : 'Download High-Res'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Download Button */}
              <div className="mt-6 flex justify-center md:hidden">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  {isDownloading ? 'Downloading...' : 'Download High-Res'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
