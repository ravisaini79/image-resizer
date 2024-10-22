import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { Link } from 'react-router-dom';
import {
  Container,
  Button,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
const ImageResizer = ({ selectedImage, setSelectedImage, onBack }) => {
    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);
    const [resolution, setResolution] = useState(72);
    const [format, setFormat] = useState('JPG');
    const [quality, setQuality] = useState(90);
    const [background, setBackground] = useState('white');
    const [resizedImage, setResizedImage] = useState(null);
    const [imageSize, setImageSize] = useState(0);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [originalImageSize, setOriginalImageSize] = useState(0);
    const canvasRef = useRef(null);
  
    useEffect(() => {
      const img = new Image();
      img.src = selectedImage;
  
      img.onload = () => {
        // Set original image dimensions
        setOriginalSize({ width: img.width, height: img.height });
  
        // Calculate original image size in KB
        const imgFileSize = Math.round((img.src.length * (3 / 4)) / 1024);
        setOriginalImageSize(imgFileSize);
      };
    }, [selectedImage]);
  
    const handleResizeImage = () => {
      const img = new Image();
      img.src = selectedImage;
  
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const aspectRatio = img.width / img.height;
  
        // Calculate new height to maintain aspect ratio
        let newWidth = width;
        let newHeight = height ? height : newWidth / aspectRatio;
  
        // Set canvas size based on user inputs
        canvas.width = newWidth;
        canvas.height = newHeight;
  
        // Set background color for canvas
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
  
        // Draw the resized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        // Convert the canvas to the selected format and quality
        const qualityFactor = quality / 100;
        const resizedImageUrl = canvas.toDataURL(`image/${format.toLowerCase()}`, qualityFactor);
  
        setResizedImage(resizedImageUrl);
  
        // Calculate resized image size in KB
        const sizeInKB = Math.round((resizedImageUrl.length * (3 / 4)) / 1024);
        setImageSize(sizeInKB);
      };
    };
  
    const handleDownloadImage = () => {
      const fileExtension = format.toLowerCase();
      saveAs(resizedImage, `resized_image.${fileExtension}`);
    };
  
    const handleConvertToPDF = () => {
      const pdf = new jsPDF();
      pdf.addImage(resizedImage, format.toLowerCase(), 10, 10, 180, 160);
      pdf.save('resized_image.pdf');
    };
  
    const onBackHandler = () => {
      window.location.reload();
    };
    

  
    return (
      <div className="resizer-container">
        <h2>Choose new size and format</h2>
  
        {/* Display original image and size */}
        <div className="original-section">
          <h3>Original Image</h3>
          <img src={selectedImage} alt="Original" style={{ maxWidth: '100%' }} />
          <p>Original Size: {originalSize.width}x{originalSize.height}px</p>
          <p>Original File Size: {originalImageSize} KB</p>
        </div>
  
        <div className="form-group">
          <label>Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
          <label>Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <label>Resolution (DPI)</label>
          <input
            type="number"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Format</label>
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="JPG">JPG</option>
            <option value="PNG">PNG</option>
            <option value="WEBP">WEBP</option>
          </select>
          <label>Quality</label>
          <input
            type="number"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Background</label>
          <div>
            <input
              type="radio"
              value="white"
              checked={background === 'white'}
              onChange={() => setBackground('white')}
            />
            <label>White</label>
            <input
              type="radio"
              value="black"
              checked={background === 'black'}
              onChange={() => setBackground('black')}
            />
            <label>Black</label>
          </div>
        </div>
        <button onClick={handleResizeImage}>Resize Image</button>
  
        {/* Hidden canvas used for resizing */}
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
  
        {resizedImage && (
          <div className="preview-section">
            <h3>Resized Image Preview</h3>
            <img src={resizedImage} alt="Resized" style={{ maxWidth: '100%' }} />
            <p>Size: {imageSize} KB</p>
            <button onClick={handleDownloadImage}>Download Image</button>
            <button onClick={handleConvertToPDF}>Convert to PDF</button>
          </div>
        )}
  
        {/* Button to go back */}
       
        <Button variant="contained" color="primary" onClick={onBackHandler} sx={{ marginBottom: 2 }}>
          Go Back
        </Button>
      
      </div>
    );
  };
  
  export default ImageResizer;
  