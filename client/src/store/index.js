// src/store/index.js
import { proxy } from "valtio";

const state = proxy({
  intro: true,
  color: "#EFBD48",
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: "./threejs.png",
  fullDecal: "./threejs.png",
  selectedModel: "/models/womens_shirt.glb", // 👈 default model
});

export default state;
