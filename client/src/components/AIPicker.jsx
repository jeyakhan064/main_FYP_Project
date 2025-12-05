import React, { useState } from "react";
import { useSnapshot } from "valtio";
import state from "../store";
import CustomButton from "./CustomButton";

// Contextual prompt templates
const CONTEXTUAL_PROMPTS = [
  { id: 1, label: "Abstract Art", prompt: "abstract colorful flowing shapes and patterns" },
  { id: 2, label: "Pakhtoon", prompt: "traditional Pakhtoon design with cultural patterns and tribal motifs" },
  { id: 3, label: "Geometric", prompt: "modern geometric patterns with clean lines" },
  { id: 4, label: "Vintage", prompt: "vintage retro design with classic typography" },
  { id: 5, label: "Sindhi", prompt: "traditional Sindhi ajrak pattern with intricate geometric designs and cultural motifs" },
  { id: 6, label: "Floral", prompt: "beautiful floral pattern with flowers and leaves" },
  { id: 7, label: "Animal", prompt: "majestic wild animal in natural habitat" },
  { id: 8, label: "Space", prompt: "cosmic space scene with stars and planets" },
  { id: 9, label: "Urban", prompt: "urban street art with graffiti and city elements" },
  { id: 10, label: "Tribal", prompt: "tribal ethnic pattern with cultural motifs" },
];

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  const snap = useSnapshot(state);
  const [selectedDecalPosition, setSelectedDecalPosition] = useState("full");
  const [lastGeneratedPrompt, setLastGeneratedPrompt] = useState("");
  const [regenerationCount, setRegenerationCount] = useState(0);

  // Check if current model is pants
  const isPantsModel = snap.selectedModel && snap.selectedModel.includes('the_pants');

  // Handle contextual prompt click
  const handleContextualPrompt = (contextualPrompt) => {
    setPrompt(contextualPrompt);
  };

  // Handle generate with selected position
  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt or select a contextual prompt");
      return;
    }
    setLastGeneratedPrompt(prompt);
    setRegenerationCount(0); // Reset regeneration count on new prompt
    handleSubmit(selectedDecalPosition);
  };

  // Handle regenerate (same prompt, different variation)
  const handleRegenerate = () => {
    if (!lastGeneratedPrompt) {
      alert("Generate a design first before regenerating");
      return;
    }

    // Add variation modifiers to get different results
    const variationModifiers = [
      "alternative style",
      "different perspective",
      "unique variation",
      "creative take",
      "fresh interpretation",
      "new angle"
    ];

    const newCount = regenerationCount + 1;
    setRegenerationCount(newCount);

    // Add variation modifier to prompt for more diverse results
    const modifier = variationModifiers[newCount % variationModifiers.length];
    const enhancedPrompt = `${lastGeneratedPrompt}, ${modifier}`;

    setPrompt(lastGeneratedPrompt); // Keep original prompt visible to user
    handleSubmit(selectedDecalPosition, enhancedPrompt); // But send enhanced version to API
  };

  return (
    <div className="flex flex-col w-full space-y-3">
      {/* Text Input Area */}
      <div className="relative">
        <textarea
          placeholder="Describe your design (e.g., 'a tiger roaring', 'floral pattern', 'geometric shapes')..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none resize-none text-sm text-gray-800 placeholder-gray-400 transition-all"
          disabled={generatingImg}
          maxLength={500}
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {prompt.length}/500
        </div>
      </div>

      {/* Contextual Prompts */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Quick Prompts:</label>
        <div className="flex flex-wrap gap-1.5">
          {CONTEXTUAL_PROMPTS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleContextualPrompt(item.prompt)}
              disabled={generatingImg}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border-2 border-gray-300 text-gray-700 hover:border-yellow-400 hover:bg-yellow-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decal Position Selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700">Apply to:</label>
        <div className="flex flex-wrap gap-1.5">
          {isPantsModel ? (
            // Pants model - Belt and Full options
            <>
              <button
                onClick={() => setSelectedDecalPosition("full")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedDecalPosition === "full"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
              >
                Belt
              </button>
              <button
                onClick={() => setSelectedDecalPosition("collar")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedDecalPosition === "collar"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
              >
                Full Coverage
              </button>
            </>
          ) : (
            // Other models - Standard decal positions
            <>
              <button
                onClick={() => setSelectedDecalPosition("full")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all relative z-10 cursor-pointer ${
                  selectedDecalPosition === "full"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
                style={{pointerEvents: 'auto'}}
              >
                Full
              </button>
              <button
                onClick={() => setSelectedDecalPosition("back")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedDecalPosition === "back"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setSelectedDecalPosition("leftSleeve")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                  selectedDecalPosition === "leftSleeve"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
              >
                L-Sleeve
              </button>
              <button
                onClick={() => setSelectedDecalPosition("rightSleeve")}
                disabled={generatingImg}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all relative z-10 cursor-pointer ${
                  selectedDecalPosition === "rightSleeve"
                    ? "bg-gray-200 text-gray-900 border-2 border-gray-400"
                    : "bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400"
                }`}
                style={{pointerEvents: 'auto'}}
              >
                R-Sleeve
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-1">
        {generatingImg ? (
          <div className="w-full flex items-center justify-center py-3 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Generating AI design...</span>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleGenerate}
              className="flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all text-gray-900 shadow-md hover:shadow-lg"
              style={{ backgroundColor: "#EFBD48" }}
            >
              Generate
            </button>
            <button
              onClick={handleRegenerate}
              disabled={!lastGeneratedPrompt}
              className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg ${
                !lastGeneratedPrompt
                  ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              title="Generate a different variation of the same design"
            >
              Regenerate
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;
