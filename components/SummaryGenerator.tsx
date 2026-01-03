import React, { useState } from 'react';
import { generateSummary } from '../services/geminiService';
import { mockDb } from '../services/mockFirebase';
import { Summary } from '../types';
import { FileText, Loader2, Save, Upload } from 'lucide-react';

export const SummaryGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setSaved(false);
    try {
      const result = await generateSummary(inputText);
      setSummary(result);
    } catch (error) {
      alert("Failed to generate summary. Please check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!summary) return;
    const newSummary: Summary = {
      id: Date.now().toString(),
      title: "Summary: " + inputText.substring(0, 30) + "...",
      originalText: inputText,
      summaryText: summary,
      createdAt: Date.now()
    };
    await mockDb.saveSummary(newSummary);
    setSaved(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simple text file reading
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInputText(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800">AI Summary Generator</h2>
        <p className="text-slate-600">Paste chapter text or upload a text file to get instant, concise summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
        {/* Input Section */}
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-700">Source Text</label>
            <div className="relative">
               <input 
                 type="file" 
                 id="file-upload" 
                 className="hidden" 
                 accept=".txt,.md"
                 onChange={handleFileUpload}
               />
               <label 
                 htmlFor="file-upload" 
                 className="cursor-pointer flex items-center space-x-1 text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full transition-colors"
               >
                 <Upload size={14} />
                 <span>Upload Text</span>
               </label>
            </div>
          </div>
          <textarea
            className="flex-1 w-full p-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none transition-all text-sm leading-relaxed"
            placeholder="Paste your educational content here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Generating Summary...</span>
              </>
            ) : (
              <>
                <FileText size={20} />
                <span>Summarize Text</span>
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-700">AI Summary</label>
            {summary && (
              <button 
                onClick={handleSave}
                disabled={saved}
                className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full transition-colors ${saved ? 'text-green-600 bg-green-50' : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'}`}
              >
                <Save size={14} />
                <span>{saved ? 'Saved to Profile' : 'Save Summary'}</span>
              </button>
            )}
          </div>
          <div className="flex-1 w-full p-6 rounded-xl border border-slate-200 bg-white shadow-sm overflow-y-auto prose prose-indigo prose-sm max-w-none">
            {summary ? (
              <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                {summary}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                <FileText size={48} className="opacity-20" />
                <p>Summary will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};