import React, { useEffect } from "react";
import {
  isCompressed,
  decompress,
  isNIFTI,
  readHeader,
  readImage,
} from "nifti-reader-js";

const FileUpload = ({ onFileUpload, defaultFile }) => {
  useEffect(() => {
    if (defaultFile) {
      handleDefaultFileLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleNiftiFile(file);
    }
  };

  const handleDefaultFileLoad = async () => {
    try {
      const response = await fetch(defaultFile);
      const blob = await response.blob();

      const file = new File([blob], "default_nifti_file.nii", {
        type: blob.type,
      });
      handleNiftiFile(file);
    } catch (error) {
      console.error("Error loading default file:", error);
    }
  };

  const handleNiftiFile = (file) => {
    if (!(file instanceof Blob)) {
      console.error("Provided file is not a Blob or File.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target.result;
        if (!(arrayBuffer instanceof ArrayBuffer)) {
          console.error("Error: The result is not an ArrayBuffer.");
          return;
        }
        const data = new Uint8Array(arrayBuffer);
        const buffer = data.buffer;

        if (isCompressed(buffer)) {
          try {
            const decompressedData = await decompress(data);
            handleNiftiData(decompressedData);
          } catch (error) {
            console.error("Error decompressing file:", error);
            return;
          }
        } else {
          handleNiftiData(data);
        }
      } catch (error) {
        console.error("Error reading file as ArrayBuffer:", error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleNiftiData = (data) => {
    const buffer = data.buffer || data; // Ensure data is in ArrayBuffer format
    if (isNIFTI(buffer)) {
      const niftiHeader = readHeader(buffer);
      const niftiImage = readImage(niftiHeader, buffer);
      onFileUpload({
        header: niftiHeader,
        image: niftiImage,
      });
    } else {
      console.error("Uploaded file is not a valid NIfTI file");
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleDefaultFileLoad}>Load Default File</button>
    </div>
  );
};

export default FileUpload;
