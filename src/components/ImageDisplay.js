// src/components/ImageDisplay.js
import React from "react";

const ImageDisplay = ({ imageData, sliceIndex }) => {
  const { header, image } = imageData;
  const cols = header.dims[1];
  const rows = header.dims[2];

  const getSlice = (sliceIndex) => {
    const sliceSize = cols * rows;
    const slice = new Uint8ClampedArray(sliceSize);
    for (let i = 0; i < sliceSize; i++) {
      slice[i] = image[sliceIndex * sliceSize + i];
    }
    return slice;
  };

  const slice = getSlice(sliceIndex);
  const imageDataArray = new ImageData(slice, cols, rows);

  return (
    <canvas
      width={cols}
      height={rows}
      ref={(canvas) => {
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.putImageData(imageDataArray, 0, 0);
        }
      }}
    />
  );
};

export default ImageDisplay;
