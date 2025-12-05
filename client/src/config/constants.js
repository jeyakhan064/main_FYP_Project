// Import all the icons and images used for your tabs
import {
  swatch,
  fileIcon,
  ai,
  logoShirt,
  stylishShirt,
  backIcon,
  leftSleeveIcon,
  rightSleeveIcon,
  pocketIcon,
  collarIcon,
  hoodIcon,
  tagIcon,
} from "../assets";

// -------------------------
// 🧩 EDITOR TABS
// -------------------------
// These are the tools the user can use to edit the shirt.
export const EditorTabs = [
  {
    name: "colorpicker", // pick colors
    icon: swatch,
  },
  {
    name: "filepicker", // upload images
    icon: fileIcon,
  },
  {
    name: "aipicker", // use AI to generate designs
    icon: ai,
  },
];

// -------------------------
// 🎨 FILTER TABS
// -------------------------
// These let the user select which part of the shirt they’re editing.
export const FilterTabs = [
  {
    name: "stylishShirt",
    icon: stylishShirt,
  },
  {
    name: "backShirt",
    icon: backIcon,
  },
  {
    name: "leftSleeveShirt",
    icon: leftSleeveIcon,
  },
  {
    name: "rightSleeveShirt",
    icon: rightSleeveIcon,
  },
  // {
  //   name: "pocketShirt",
  //   icon: pocketIcon,
  // },
  {
    name: "collarShirt",
    icon: collarIcon,
  },
  // {
  //   name: "hoodShirt",
  //   icon: hoodIcon,
  // },
  {
    name: "tagShirt",
    icon: tagIcon,
  },
];

// -------------------------
// 👕 DECAL TYPES
// -------------------------
// These define how each design image (decal) is applied on the shirt.
export const DecalTypes = {
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishShirt",
  },
  back: {
    stateProperty: "backDecal",
    filterTab: "backShirt",
  },
  leftSleeve: {
    stateProperty: "leftSleeveDecal",
    filterTab: "leftSleeveShirt",
  },
  rightSleeve: {
    stateProperty: "rightSleeveDecal",
    filterTab: "rightSleeveShirt",
  },
  pocket: {
    stateProperty: "pocketDecal",
    filterTab: "pocketShirt",
  },
  collar: {
    stateProperty: "collarDecal",
    filterTab: "collarShirt",
  },
  hood: {
    stateProperty: "hoodDecal",
    filterTab: "hoodShirt",
  },
  tag: {
    stateProperty: "tagDecal",
    filterTab: "tagShirt",
  },
};
