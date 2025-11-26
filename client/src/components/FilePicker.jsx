import React from "react";
import CustomButton from "./CustomButton";

const FilePicker = ({ file, setFile, readFile }) => {
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

      {/* Buttons Section - 5 Decal Areas */}
      <div className="flex flex-wrap justify-center gap-2 w-full">
        <CustomButton
          type="outline"
          title="Logo"
          handleClick={() => readFile("logo")}
          customStyles="text-xs px-3 py-1.5 whitespace-nowrap"
        />
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
      </div>
    </div>
  );
};

export default FilePicker;
