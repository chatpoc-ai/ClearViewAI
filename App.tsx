import React, { useState, useEffect } from 'react';
import { Uploader } from './components/Uploader';
import { Button } from './components/Button';
import { ComparisonSlider } from './components/ComparisonSlider';
import { ProcessingControls } from './components/ProcessingControls';
import { removeWatermark } from './services/geminiService';
import { AppState, ProcessingOptions, AlertMessage } from './types';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    aggressiveness: 50,
    detectOnly: false
  });
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  // Clear alert after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setAlert({ type: 'error', message: 'File too large. Please upload an image smaller than 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
        setAppState(AppState.PREVIEW);
        setProcessedImage(null);
        setAlert(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setAppState(AppState.PROCESSING);
    setAlert(null);

    try {
      const resultBase64 = await removeWatermark(originalImage, processingOptions);
      setProcessedImage(resultBase64);
      setAppState(AppState.COMPLETED);
    } catch (error: any) {
      setAppState(AppState.PREVIEW);
      setAlert({ 
        type: 'error', 
        message: error.message || 'Failed to process image. Please try again.' 
      });
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setAppState(AppState.IDLE);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `clearview-cleaned-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              ClearView AI
            </span>
          </div>
          <div>
            <a href="#" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl -z-10 mix-blend-screen pointer-events-none"></div>

        {/* Alert Toast */}
        {alert && (
          <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl border backdrop-blur-md z-50 animate-pulse-fast ${
            alert.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-200' : 
            alert.type === 'info' ? 'bg-blue-500/10 border-blue-500/50 text-blue-200' : 'bg-green-500/10 border-green-500/50 text-green-200'
          }`}>
            {alert.message}
          </div>
        )}

        {/* State: IDLE */}
        {appState === AppState.IDLE && (
          <div className="text-center w-full max-w-3xl space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
                Remove Watermarks <br/>
                <span className="text-primary-500">Instantly with AI</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Upload your image and let our advanced Gemini-powered AI detect and erase watermarks, logos, and text automatically.
              </p>
            </div>
            <Uploader onImageSelect={handleImageSelect} />
            <p className="text-xs text-slate-600 mt-8">By uploading an image you agree to our Terms of Service. Please respect copyright laws.</p>
          </div>
        )}

        {/* State: PREVIEW & PROCESSING */}
        {(appState === AppState.PREVIEW || appState === AppState.PROCESSING) && originalImage && (
          <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Image Preview Area */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[400px] relative overflow-hidden">
               {appState === AppState.PROCESSING && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                   <div className="relative w-24 h-24">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-700 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 rounded-full animate-spin border-t-transparent"></div>
                   </div>
                   <p className="mt-4 text-white font-medium animate-pulse">Analyzing & Removing...</p>
                 </div>
               )}
               <img 
                src={originalImage} 
                alt="Preview" 
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl" 
               />
            </div>

            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 space-y-6">
              <ProcessingControls 
                options={processingOptions} 
                onChange={setProcessingOptions} 
                disabled={appState === AppState.PROCESSING}
              />
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleProcess} 
                  isLoading={appState === AppState.PROCESSING}
                  className="w-full py-3 text-lg"
                >
                  {appState === AppState.PROCESSING ? 'Processing...' : 'Remove Watermark'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={appState === AppState.PROCESSING}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* State: COMPLETED */}
        {appState === AppState.COMPLETED && originalImage && processedImage && (
          <div className="w-full max-w-6xl flex flex-col items-center space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-white">Result</h2>
            
            <ComparisonSlider beforeImage={originalImage} afterImage={processedImage} />
            
            <div className="flex gap-4 mt-8">
              <Button onClick={handleDownload} className="px-8 py-3 text-lg" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              }>
                Download Image
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Process Another
              </Button>
            </div>
            
             <p className="text-sm text-slate-500 mt-4">
              Satisfied with the result? AI generation may vary. Try adjusting aggressiveness if artifacts remain.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;