import React from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store';

const ColorPicker = () => {
  const snap = useSnapshot(state);

  // Handle base color change only (no decals)
  const handleColorChange = (color) => {
    state.color = color.hex;
  };

  return (
    <div className="flex flex-col items-center w-full justify-start overflow-hidden">
      {/* Color Picker - Base Model Color Only */}
      <div className="transform scale-90">
        <SketchPicker
          color={snap.color}
          disableAlpha
          onChange={handleColorChange}
          width="240px"
        />
      </div>
    </div>
  )
}

export default ColorPicker
