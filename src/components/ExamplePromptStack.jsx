import React, { useState } from 'react';
import { Check, Copy, HelpCircle, X } from 'lucide-react';

const ExamplePromptStack = ({ examplePrompt, onUse, showPrompt, onToggle }) => {
  const [copied, setCopied] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopyFeedback('Copied!');
      
      // Show feedback briefly before closing
      setTimeout(() => {
        setCopied(false);
        setCopyFeedback('');
        onToggle(); // Close the overlay
      }, 800); // Reduced time for smoother UX
      
    } catch (err) {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors bg-white shadow-md z-20"
      >
        <HelpCircle className="w-4 h-4" />
        <span>prompt</span>
      </button>

      {showPrompt && (
        <>
          {/* Overlay background */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity"
            onClick={onToggle}
          />

          {/* Centered card container */}
          <div className="fixed inset-0 z-40 overflow-auto flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl">
              {/* Stack effect shadow cards */}
              <div className="absolute top-2 left-2 w-full h-full bg-gray-200 rounded-lg"></div>
              <div className="absolute top-1 left-1 w-full h-full bg-gray-100 rounded-lg"></div>

              {/* Main card */}
              <div className="relative bg-white shadow-lg rounded-lg border border-gray-200">
                {/* Header with close button */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Example Prompt</h3>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Prompt text area */}
                    <div className="relative bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 pr-12">
                        {examplePrompt}
                      </pre>
                      
                      {/* Copy button with feedback */}
                      <div className="absolute top-2 right-2">
                        <button
                          className="p-2 hover:bg-gray-200 rounded-md transition-colors group relative"
                          onClick={() => handleCopy(examplePrompt)}
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                          
                          {/* Tooltip */}
                          <span className="absolute -top-8 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Copy to clipboard
                          </span>
                        </button>
                      </div>

                      {/* Copy feedback message */}
                      {copyFeedback && (
                        <div className="absolute top-2 right-12 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                          {copyFeedback}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 mt-2">
                      <button 
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                        onClick={() => {
                          handleCopy(examplePrompt);
                          onUse && onUse();
                        }}
                      >
                        Use this prompt
                      </button>
                      <button 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors font-medium"
                        onClick={onToggle}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ExamplePromptStack;