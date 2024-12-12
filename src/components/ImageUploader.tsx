import React, { useState } from 'react';

interface ImageUploaderProps {
  onPixelsReady: (pixels: string[][]) => void;
  pixelSize: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onPixelsReady, pixelSize }) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const convertToPixels = async () => {
    if (image) {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const reader = new FileReader();

      reader.onload = e => {
        if (e.target && typeof e.target.result === 'string') {
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx!.drawImage(img, 0, 0);
            const scaledWidth = Math.ceil(img.width / pixelSize);
            const scaledHeight = Math.ceil(img.height / pixelSize);
            const pixels = [];

            for (let y = 0; y < scaledHeight; y++) {
              const row = [];
              for (let x = 0; x < scaledWidth; x++) {
                const startX = x * pixelSize;
                const startY = y * pixelSize;
                const imageData = ctx!.getImageData(startX, startY, pixelSize, pixelSize);
                const avgColor = getAverageColor(imageData);
                row.push(`rgb(${avgColor.r},${avgColor.g},${avgColor.b})`);
              }
              pixels.push(row);
            }

            onPixelsReady(pixels);
          };
          img.src = e.target.result;
        }
      };

      reader.readAsDataURL(image);
    }
  };

  function getAverageColor(imageData: ImageData) {
    const data = imageData.data;
    let r = 0, g = 0, b = 0;
    const total = imageData.width * imageData.height;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / total);
    g = Math.floor(g / total);
    b = Math.floor(b / total);

    return { r, g, b };
  }

  return (
    <div>
      Upload:<input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={convertToPixels}>Convert to Pixels</button>
    </div>
  );
};

export default ImageUploader;
