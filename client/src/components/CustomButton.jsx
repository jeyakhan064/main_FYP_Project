import React from 'react'
import { useSnapshot } from 'valtio';

import state from '../store';
import { getContrastingColor } from '../config/helpers';

const CustomButton = ({ type, title, customStyles, handleClick }) => {
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
            className={`px-4 py-2 font-bold rounded ${customStyles}`}

      style={generateStyle(type)}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton