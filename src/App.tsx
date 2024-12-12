// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import React, {useState} from "react";
import ImageUploader from "./components/ImageUploader.tsx";

interface PixelArtProps {
    pixels: string[][];
    pixelSize?: number;
    style?: React.CSSProperties;
}

const PixelArt: React.FC<PixelArtProps> = ({pixels, pixelSize = 10, style}) => {
    return (
        <div style={{...style, display: 'flex', flexWrap: 'wrap', width: pixelSize * pixels[0].length}}>
            {pixels.map((row, rowIndex) =>
                row.map((color, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: pixelSize,
                            height: pixelSize,
                            backgroundColor: color,
                        }}
                    />
                ))
            )}
        </div>
    );
};

function App() {

    // const pixels = [
    //    ['#FF0000', '#00FF00', '#0000FF'],
    //    ['#FFFFFF', '#000000', '#FFFF00'],
    //    ['#00FFFF', '#FF00FF', '#C0C0C0'],
    //  ];
    const [pixels, setPixels] = useState<string[][]>([]);
    const [pixelSize, setPixelSize] = useState<number>(10);
    const handlePixelSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPixelSize(Number(event.target.value));
    };

    return (
        <div className="App">
            <div className="control">
                Set Pixel Size:
                <input
                    id="pixelSize"
                    type="number"
                    value={pixelSize}
                    onChange={handlePixelSizeChange}
                    // 可以设置最小和最大值，例如从1到50，避免过小或过大的值
                    min="1"
                    max="50"
                />
                <ImageUploader onPixelsReady={setPixels} pixelSize={pixelSize}/>
            </div>
            {pixels[0] && <PixelArt pixels={pixels} pixelSize={pixelSize}/>}
        </div>
    );
}

export default App
