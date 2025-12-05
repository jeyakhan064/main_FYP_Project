// src/store/index.js
import { proxy } from "valtio";

// Load model from localStorage or use default
const savedModel = typeof window !== 'undefined' ? localStorage.getItem('selectedModel') : null;

// 🧠 Global state (Valtio proxy)
const state = proxy({
  intro: true,
  color: "#EFBD48",

  // 🧩 Texture toggles
  isFullTexture: false,
  isBackTexture: false,
  isLeftSleeveTexture: false,
  isRightSleeveTexture: false,
  isPocketTexture: false,
  isCollarTexture: false,
  isHoodTexture: false,
  isTagTexture: false,

  // 🖼️ Decal images
  fullDecal: "/threejs.png",
  backDecal: "/threejs.png",
  leftSleeveDecal: "/threejs.png",
  rightSleeveDecal: "/threejs.png",
  pocketDecal: "/threejs.png",
  collarDecal: "/threejs.png",
  hoodDecal: "/threejs.png",
  tagDecal: "/threejs.png",

  // 👕 Currently selected 3D model (persist on refresh)
  selectedModel: savedModel || "/models/womens_top.glb",
});


// 🧰 Helper: Apply a decal (sets texture + enables toggle)
export const applyDecal = (type, url) => {
  switch (type) {
    case "full":
      state.fullDecal = url;
      state.isFullTexture = true;
      break;

    case "leftSleeve":
      state.leftSleeveDecal = url;
      state.isLeftSleeveTexture = true;
      break;

    case "rightSleeve":
      state.rightSleeveDecal = url;
      state.isRightSleeveTexture = true;
      break;

    case "collar":
      state.collarDecal = url;
      state.isCollarTexture = true;
      break;

    case "tag":
      state.tagDecal = url;
      state.isTagTexture = true;
      break;

    case "back":
      state.backDecal = url;
      state.isBackTexture = true;
      break;

    default:
      console.warn("Unknown decal type:", type);
  }
};


// 🧩 Helper: Toggle decal visibility
export const toggleDecal = (type) => {
  switch (type) {
    case "full":
      state.isFullTexture = !state.isFullTexture;
      break;

    case "leftSleeve":
      state.isLeftSleeveTexture = !state.isLeftSleeveTexture;
      break;

    case "rightSleeve":
      state.isRightSleeveTexture = !state.isRightSleeveTexture;
      break;

    case "collar":
      state.isCollarTexture = !state.isCollarTexture;
      break;

    case "tag":
      state.isTagTexture = !state.isTagTexture;
      break;

    case "back":
      state.isBackTexture = !state.isBackTexture;
      break;

    default:
      console.warn("Unknown toggle type:", type);
  }
};


// 🔄 Helper: Switch model dynamically
export const setSelectedModel = (path) => {
  state.selectedModel = path;

  // Save to localStorage for persistence
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedModel', path);
  }

  // Reset all decal textures when switching models
  state.isFullTexture = false;
  state.isBackTexture = false;
  state.isLeftSleeveTexture = false;
  state.isRightSleeveTexture = false;
  state.isPocketTexture = false;
  state.isCollarTexture = false;
  state.isHoodTexture = false;
  state.isTagTexture = false;

  // Reset decal images
  state.fullDecal = "";
  state.backDecal = "";
  state.leftSleeveDecal = "";
  state.rightSleeveDecal = "";
  state.pocketDecal = "";
  state.collarDecal = "";
  state.hoodDecal = "";
  state.tagDecal = "";
};

export default state;
