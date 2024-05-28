import React, { useState } from "react";
import {
  isCompressed,
  decompress,
  isNIFTI,
  readHeader,
  readImage,
} from "nifti-reader-js";
import FileUpload from "./components/FileUpload";
import ImageDisplay from "./components/ImageDisplay";
import CustomSlider from "./components/Slider";

const App = () => {
  const [imageData, setImageData] = useState(null);
  const [sliceIndex, setSliceIndex] = useState(0);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = new Uint8Array(event.target.result); // Use const for data
      if (isCompressed(data)) {
        // Call functions from nifti-reader-js
        try {
          const decompressedData = decompress(data);
          handleNiftiData(decompressedData);
        } catch (error) {
          console.error("Error decompressing file:", error);
          return;
        }
      } else {
        handleNiftiData(data);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleNiftiData = (data) => {
    if (isNIFTI(data.buffer)) {
      // Call function from nifti-reader-js
      const niftiHeader = readHeader(data.buffer); // Call functions from nifti-reader-js
      const niftiImage = readImage(niftiHeader, data.buffer); // Call functions from nifti-reader-js
      setImageData({
        header: niftiHeader,
        image: niftiImage,
      });
      setSliceIndex(0);
    } else {
      console.error("Uploaded file is not a valid NIfTI file");
    }
  };

  return (
    <div className="App">
      <h1>NIfTI Image Viewer</h1>
      <FileUpload
        onFileUpload={handleFileUpload}
        defaultFile={`${process.env.PUBLIC_URL}/sub-PAT27_T1w.nii`}
      />
      {imageData && (
        <>
          <ImageDisplay imageData={imageData} sliceIndex={sliceIndex} />
          <CustomSlider
            max={imageData.header.dims[3] - 1}
            onChange={setSliceIndex}
          />
        </>
      )}
    </div>
  );
};

export default App;
