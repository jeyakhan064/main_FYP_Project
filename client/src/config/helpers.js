export const downloadCanvasToImage = () => {
  try {
    const canvas = document.querySelector("canvas");

    if (!canvas) {
      console.error("❌ Canvas not found");
      alert("Canvas not found. Please wait for the 3D model to load.");
      return;
    }

    console.log("📸 Starting canvas download...");
    console.log("Canvas size:", canvas.width, "x", canvas.height);

    // Get WebGL canvas as dataURL first (works with both 2D and WebGL canvases)
    const dataURL = canvas.toDataURL("image/png");

    // Load into Image to then draw on 2D canvas for cropping
    const img = new Image();
    img.onload = () => {
      // Create temp 2D canvas from WebGL canvas
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // Now get image data for cropping
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const pixels = imageData.data;

      // Find bounding box of non-white pixels
      let minX = tempCanvas.width;
      let minY = tempCanvas.height;
      let maxX = 0;
      let maxY = 0;

      // Scan all pixels to find the content bounds
      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const i = (y * tempCanvas.width + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          // Check if pixel is not white/transparent (with some tolerance)
          const isNotWhite = (r < 250 || g < 250 || b < 250) && a > 10;

          if (isNotWhite) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      console.log("📏 Content bounds:", { minX, minY, maxX, maxY });

      // Check if we found any content
      if (minX >= maxX || minY >= maxY) {
        console.warn("⚠️ No content found in canvas, downloading full canvas");
        // Fallback to original method if no content detected
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "custom-design.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Add padding around the content (10% of content size)
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const padding = Math.max(contentWidth, contentHeight) * 0.1;

      minX = Math.max(0, minX - padding);
      minY = Math.max(0, minY - padding);
      maxX = Math.min(tempCanvas.width, maxX + padding);
      maxY = Math.min(tempCanvas.height, maxY + padding);

      const croppedWidth = maxX - minX;
      const croppedHeight = maxY - minY;

      console.log("✂️ Cropping to:", croppedWidth, "x", croppedHeight);

      // Create a new canvas with cropped dimensions
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext("2d");

      // Draw the cropped portion from temp canvas
      croppedCtx.drawImage(
        tempCanvas,
        minX, minY, croppedWidth, croppedHeight,  // Source rectangle
        0, 0, croppedWidth, croppedHeight          // Destination rectangle
      );

      // Download the cropped image
      const croppedDataURL = croppedCanvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = croppedDataURL;
      link.download = "custom-design.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log("✅ Downloaded cropped image:", {
        original: `${canvas.width}x${canvas.height}`,
        cropped: `${croppedWidth}x${croppedHeight}`,
        saved: `${Math.round((1 - (croppedWidth * croppedHeight) / (canvas.width * canvas.height)) * 100)}% smaller`
      });
    };

    img.onerror = () => {
      console.error("❌ Failed to load canvas image data");
      alert("Failed to process canvas image. Please try again.");
    };

    img.src = dataURL;
  } catch (error) {
    console.error("❌ Error downloading canvas:", error);
    alert("Failed to download image. Error: " + error.message);
  }
};

export const reader = (file) =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader(); // ✅ correct variable name
    fileReader.onload = () => {
      console.log("Uploaded decal data:", fileReader.result); // 👈 this will now print
      resolve(fileReader.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });

export const getContrastingColor = (color) => {
  // Remove the '#' character if it exists
  const hex = color.replace("#", "");

  // Convert the hex string to RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Return black or white depending on the brightness
  return brightness > 128 ? "black" : "white";
};
