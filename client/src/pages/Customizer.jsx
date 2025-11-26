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
    logoShirt: true,
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
  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      setGeneratingImg(true);
      const response = await fetch("http://localhost:8080/api/v1/dalle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert("Error generating image:", error);
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
      logoShirt: "isLogoTexture",
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
      image: canvasSnapshot || snap.logoDecal || "/threejs.png", // Use canvas snapshot
      price: 8999, // PKR
      color: snap.color,
      isCustomized: true,
      // Store full customization state for backend
      customization: {
        color: snap.color,
        selectedModel: snap.selectedModel,
        decals: {
          logo: snap.isLogoTexture ? snap.logoDecal : null,
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
      {/* Top Right Action Buttons */}
      <motion.div
        className="absolute z-20 top-20 right-6 flex gap-3"
        {...fadeAnimation}
      >
        <motion.button
          onClick={() => downloadCanvasToImage()}
          className="px-5 py-2.5 rounded-md font-bold text-sm text-gray-900 shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: "#EFBD48" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Download
        </motion.button>
        <motion.button
          onClick={handleAddToCart}
          className="px-6 py-2.5 rounded-md font-bold text-sm text-gray-900 shadow-md hover:shadow-lg transition-all"
          style={{ backgroundColor: addedToCart ? "#10B981" : "#EFBD48" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
        </motion.button>
      </motion.div>

      {/* Left Side - Two Equal Grids with Golden Borders */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4 max-h-[calc(100vh-120px)] overflow-y-auto">
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
          className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 w-[270px]"
          style={{ border: '2px solid #EFBD48' }}
        >
          <h3 className="text-gray-800 font-bold text-sm mb-2">
            Upload Design
          </h3>
          <FilePicker file={file} setFile={setFile} readFile={readFile} />
        </motion.div>
      </div>

      {/* Floating AI Assistant Icon (Above Cart) */}
      <motion.div
        className="fixed bottom-24 right-6 z-20"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <motion.button
          onClick={() => setActiveEditorTab(activeEditorTab === "aipicker" ? "" : "aipicker")}
          className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:shadow-xl transition-all overflow-hidden"
          style={{ backgroundColor: "#EFBD48" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="AI Design Assistant"
        >
          <img
            src="/assets/ai.png"
            alt="AI Assistant"
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.textContent = 'AI';
            }}
          />
        </motion.button>

        {/* AI Popup Interface */}
        <AnimatePresence>
          {activeEditorTab === "aipicker" && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute bottom-20 right-0 bg-white/98 backdrop-blur-sm rounded-2xl shadow-2xl p-5 w-[420px] max-h-[600px] overflow-y-auto"
              style={{ border: '2px solid #EFBD48' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <img src="/assets/ai.png" alt="AI" className="w-6 h-6" />
                  <h4 className="font-bold text-base text-gray-800">AI Design Assistant</h4>
                </div>
                <button
                  onClick={() => setActiveEditorTab("")}
                  className="text-gray-400 hover:text-gray-800 text-2xl leading-none transition-colors"
                >
                  ×
                </button>
              </div>

              {/* AI Content */}
              <AIPicker
                prompt={prompt}
                setPrompt={setPrompt}
                generatingImg={generatingImg}
                handleSubmit={handleSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};



export default Customizer;