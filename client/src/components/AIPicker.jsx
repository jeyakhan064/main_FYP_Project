import React from "react";
import CustomButton from "./CustomButton";

const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
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
        />
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          {prompt.length}/200
        </div>
      </div>

      {/* Instructions
      <p className="text-xs text-gray-500 italic">
        Enter your prompt above, then click where you want to apply it:
      </p> */}

      {/* Buttons Section */}
      <div className="flex flex-wrap gap-2">
        {generatingImg ? (
          <div className="w-full flex items-center justify-center py-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Generating AI design...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Main Decal Buttons */}
            {/* <CustomButton
              type="outline"
              title="Logo"
              handleClick={() => handleSubmit("logo")}
              customStyles="text-xs px-3 py-2 whitespace-nowrap flex-1 min-w-[80px]"
            /> */}
            <CustomButton
              type="filled"
              title="Full"
              handleClick={() => handleSubmit("full")}
              customStyles="text-xs px-3 py-2 whitespace-nowrap flex-1 min-w-[80px]"
            />
            {/* <CustomButton
              type="outline"
              title="Back"
              handleClick={() => handleSubmit("back")}
              customStyles="text-xs px-3 py-2 whitespace-nowrap flex-1 min-w-[80px]"
            />
            <CustomButton
              type="outline"
              title="Left Sleeve"
              handleClick={() => handleSubmit("leftSleeve")}
              customStyles="text-xs px-3 py-2 whitespace-nowrap flex-1 min-w-[90px]"
            />
            <CustomButton
              type="outline"
              title="Right Sleeve"
              handleClick={() => handleSubmit("rightSleeve")}
              customStyles="text-xs px-3 py-2 whitespace-nowrap flex-1 min-w-[90px]"
            /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default AIPicker;
