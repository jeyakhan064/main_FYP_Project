import React from "react";
import { useSnapshot } from "valtio";
import state from "../store";
import CustomButton from "./CustomButton";

const FilePicker = ({ file, setFile, readFile }) => {
  const snap = useSnapshot(state);

  // Check if current model is pants
  const isPantsModel = snap.selectedModel && snap.selectedModel.includes('the_pants');

  return (
    <div className="flex flex-col items-center w-full">
      {/* Upload Section */}
      <div className="w-full flex flex-col items-center mb-4">
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer text-center text-gray-900 py-3 px-6 rounded-lg hover:opacity-90 transition shadow-md font-semibold text-sm"
          style={{ backgroundColor: "#EFBD48" }}
        >
          Upload File
        </label>

        <p className="mt-3 text-gray-700 text-xs truncate text-center max-w-full">
          {file === "" ? "No file selected" : file.name}
        </p>
      </div>

      {/* Buttons Section - Conditional based on model type */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {isPantsModel ? (
          // Pants model - Only Belt (full) and Full Coverage (collar) buttons
          <>
            <CustomButton
              type="filled"
              title="Belt"
              handleClick={() => readFile("full")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
            <CustomButton
              type="outline"
              title="Full"
              handleClick={() => readFile("collar")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
          </>
        ) : (
          // Other models - Standard decal buttons (NO LOGO)
          <>
            <CustomButton
              type="filled"
              title="Full"
              handleClick={() => readFile("full")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
            <CustomButton
              type="outline"
              title="Back"
              handleClick={() => readFile("back")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
            <CustomButton
              type="outline"
              title="L-Sleeve"
              handleClick={() => readFile("leftSleeve")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
            <CustomButton
              type="outline"
              title="R-Sleeve"
              handleClick={() => readFile("rightSleeve")}
              customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FilePicker;
