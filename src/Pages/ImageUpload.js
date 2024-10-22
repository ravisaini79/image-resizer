import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const ImageUpload = ({ onUpload }) => {
  const [pdfFiles, setPdfFiles] = useState([]);

  // Function to handle PDF file drop
  const handlePdfDrop = (acceptedFiles) => {
    const pdfs = acceptedFiles.filter(file => file.type === 'application/pdf');
    setPdfFiles(prevFiles => [...prevFiles, ...pdfs]);
  };

  // Function to merge PDFs
  const mergePdfs = async () => {
    if (pdfFiles.length < 2) {
      alert('Please upload at least two PDF files to merge.');
      return;
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of pdfFiles) {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0].type.includes('image')) {
        onUpload(acceptedFiles[0]);
      }
    },
  });

  const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({
    onDrop: handlePdfDrop,
    accept: 'application/pdf',
    multiple: true,
  });

  return (
    <div className="upload-container ">
      {/* Image Upload Section */}
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <h4>Resize Image Here...</h4>
        <p>Drop your images here or <span>browse</span></p>
        <button>Select Image</button>
      </div>

      {/* PDF Upload Section */}
      <div className="pdf-upload mt-3">
        <div {...getPdfRootProps({ className: 'dropzone' })}>
          {/* <input {...getPdfInputProps()} /> */}
          <h4>Merge PDF files here.. </h4>
          <Link to="/merge-pdfs">
              <button>Merge PDFs</button>
            </Link>
        </div>

        {pdfFiles.length > 0 && (
          <div>
            <h4>Selected PDF Files:</h4>
            <ul>
              {pdfFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}

        {pdfFiles.length > 1 && (
          <button onClick={mergePdfs}>Merge PDFs</button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
