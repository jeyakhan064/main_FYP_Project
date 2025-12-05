import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import { useNavigate } from "react-router-dom";

import state from "../store";
import { addToCart } from "../store/cartStore";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import {
  AIPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const navigate = useNavigate();

  // ðŸ§  Local states
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  // ðŸª„ Which filter tabs (shirt parts) are active
  const [activeFilterTab, setActiveFilterTab] = useState({
    stylishShirt: false,
    backShirt: false,
    leftSleeveShirt: false,
    rightSleeveShirt: false,
    pocketShirt: false,
    collarShirt: false,
    hoodShirt: false,
    tagShirt: false,
  });

  // ðŸ§© Decide which editor tool to show
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  // ðŸ§  Handle AI image generation
  const handleSubmit = async (type, enhancedPrompt = null) => {
    const promptToUse = enhancedPrompt || prompt;
    if (!promptToUse) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);
      console.log('🎨 Sending prompt to AI:', promptToUse);

      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse }),
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('✅ Image received from AI');
      console.log('📦 Data received:', { hasPhoto: !!data.photo, photoLength: data.photo?.length });

      if (!data.photo) {
        throw new Error('No image data received from server');
      }

      // Detect image type from base64 header or default to jpeg
      const imageType = data.photo.startsWith('/9j/') ? 'jpeg' : 'png';
      const imageData = `data:image/${imageType};base64,${data.photo}`;

      console.log('🎨 Applying image to decal type:', type);
      console.log('📸 Image data URL length:', imageData.length);

      handleDecals(type, imageData);
      console.log('✅ Image applied to model');

      alert('✨ Image generated successfully!');
    } catch (error) {
      console.error('❌ AI Generation Error:', error);
      alert(`Error generating image: ${error.message}`);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  // ðŸ§© Apply uploaded/generated image to the correct area
  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  // ðŸ§© Toggle shirt areas
  const handleActiveFilterTab = (tabName) => {
    const toggleMap = {
      stylishShirt: "isFullTexture",
      backShirt: "isBackTexture",
      leftSleeveShirt: "isLeftSleeveTexture",
      rightSleeveShirt: "isRightSleeveTexture",
      pocketShirt: "isPocketTexture",
      collarShirt: "isCollarTexture",
      hoodShirt: "isHoodTexture",
      tagShirt: "isTagTexture",
    };

    const key = toggleMap[tabName];
    if (key) state[key] = !activeFilterTab[tabName];

    setActiveFilterTab((prev) => ({
      ...prev,
      [tabName]: !prev[tabName],
    }));
  };

  // ðŸ§© Read uploaded file and apply it
  const readFile = (type) => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    reader(file)
      .then((result) => {
        console.log("Base64 result:", result.slice(0, 80) + "...");
        handleDecals(type, result);
        setActiveEditorTab("");
      })
      .catch((err) => {
        console.error("Error reading file:", err);
      });
  };

  // ðŸ›' Add customized item to cart
  const handleAddToCart = () => {
    // Capture canvas as base64 PNG for order
    const canvas = document.querySelector("canvas");
    const canvasSnapshot = canvas ? canvas.toDataURL("image/png") : null;

    const customizedItem = {
      id: `custom-${Date.now()}`, // Unique ID for customized items
      name: "Customized Apparel",
      model: snap.selectedModel || "/models/shirt_baked.glb",
      image: canvasSnapshot || "/threejs.png", // Use canvas snapshot
      price: 8999, // PKR
      color: snap.color,
      isCustomized: true,
      // Store full customization state for backend
      customization: {
        color: snap.color,
        selectedModel: snap.selectedModel,
        decals: {
          full: snap.isFullTexture ? snap.fullDecal : null,
          back: snap.isBackTexture ? snap.backDecal : null,
          leftSleeve: snap.isLeftSleeveTexture ? snap.leftSleeveDecal : null,
          rightSleeve: snap.isRightSleeveTexture ? snap.rightSleeveDecal : null,
          pocket: snap.isPocketTexture ? snap.pocketDecal : null,
          collar: snap.isCollarTexture ? snap.collarDecal : null,
          hood: snap.isHoodTexture ? snap.hoodDecal : null,
          tag: snap.isTagTexture ? snap.tagDecal : null,
        },
        canvasSnapshot, // Main product image for manufacturing
      },
    };

    addToCart(customizedItem);

    // Show visual feedback
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <>
      {/* Pointer-event blocking zones - positioned exactly over UI panels */}
      {/* Left panel blocker */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[320px] z-40"
        style={{ pointerEvents: 'auto' }}
      />
      {/* Right panel blocker */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[400px] z-40"
        style={{ pointerEvents: 'auto' }}
      />
      {/* Bottom panel blocker */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[120px] z-40"
        style={{ pointerEvents: 'auto' }}
      />

      {/* Left Side - Color & File Picker with Download/Cart Buttons */}
      <div className="absolute left-6 top-[55%] -translate-y-1/2 z-50 flex flex-col gap-4">
        {/* Color Picker Grid - Compact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[270px] overflow-hidden"
          style={{ border: '2px solid #EFBD48' }}
        >
          <h3 className="text-gray-800 font-bold text-sm mb-1">
            Color Picker
          </h3>
          <div className="overflow-hidden">
            <ColorPicker />
          </div>
        </motion.div>

        {/* File Upload Grid - Compact */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[270px] overflow-visible"
          style={{ border: '2px solid #EFBD48' }}
        >
          <h3 className="text-gray-800 font-bold text-sm mb-2">
            Upload Design
          </h3>
          <FilePicker file={file} setFile={setFile} readFile={readFile} />
        </motion.div>

        {/* Action Buttons - Download & Add to Cart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2"
        >
          <motion.button
            onClick={() => downloadCanvasToImage()}
            className="flex-1 px-4 py-2.5 rounded-md font-bold text-sm text-gray-900 shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: "#EFBD48" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Download
          </motion.button>
          <motion.button
            onClick={handleAddToCart}
            className="flex-1 px-4 py-2.5 rounded-md font-bold text-sm text-gray-900 shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: addedToCart ? "#10B981" : "#EFBD48" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {addedToCart ? "✓ Added" : "Add to Cart"}
          </motion.button>
        </motion.div>
      </div>

      {/* Right Side - AI Design Generator (Fixed Position) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute right-6 top-[20%] -translate-y-1/2 z-50 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[350px] overflow-visible"
        style={{ border: '2px solid #EFBD48' }}
      >
        <h3 className="text-gray-800 font-bold text-sm mb-2">
          AI Design Generator
        </h3>
        <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generatingImg={generatingImg}
          handleSubmit={handleSubmit}
        />
      </motion.div>

      {/* Filter Tabs - Toggle Decal Visibility - Bottom Center */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3"
          style={{ border: '2px solid #EFBD48' }}
        >
          <h3 className="text-gray-800 font-bold text-sm mb-2 text-center">
            Toggle Decals
          </h3>
          <div className="flex gap-2 justify-center">
            {FilterTabs.filter(tab =>
              ['stylishShirt', 'backShirt', 'leftSleeveShirt', 'rightSleeveShirt'].includes(tab.name)
            ).map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleActiveFilterTab(tab.name)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all border-2 ${activeFilterTab[tab.name]
                  ? 'bg-gray-200 border-gray-400'
                  : 'bg-white border-gray-300 hover:border-yellow-400'
                  }`}
                style={{ width: '70px' }}
              >
                <img src={tab.icon} alt={tab.name} className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-medium text-gray-700">
                  {tab.name === 'stylishShirt' ? 'Full' :
                    tab.name === 'backShirt' ? 'Back' :
                      tab.name === 'leftSleeveShirt' ? 'L-Sleeve' :
                        'R-Sleeve'}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};



export default Customizer;