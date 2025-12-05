import React from 'react'
import { useSnapshot } from 'valtio';

import state from '../store';
import { getContrastingColor } from '../config/helpers';

const CustomButton = ({ type, title, customStyles, handleClick, disabled }) => {
  const snap = useSnapshot(state);

  const generateStyle = (type) => {
    if(type === 'filled') {
      return {
        backgroundColor: "#EFBD48",
        color: getContrastingColor("#EFBD48")
      }
    } else if(type === "outline") {
      return {
        borderWidth: '1px',
        borderColor: "#EFBD48",
        color: "#EFBD48"
      }
    }
  }

  return (
    <button
      // className={`px-2 py-1.5 flex-1 rounded-md ${customStyles}`}
            className={`px-4 py-2 font-bold rounded ${customStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} relative z-10`}

      style={{...generateStyle(type), pointerEvents: disabled ? 'none' : 'auto'}}
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
    >
      {title}
    </button>
  )
}

export default CustomButton