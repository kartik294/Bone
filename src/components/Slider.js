import React from "react";
import Slider from "@mui/material/Slider";

const CustomSlider = ({ max, onChange }) => {
  const handleChange = (event, value) => {
    onChange(value);
  };

  return (
    <Slider
      aria-label="Custom Slider"
      defaultValue={0}
      max={max}
      onChange={handleChange}
    />
  );
};

export default CustomSlider;
