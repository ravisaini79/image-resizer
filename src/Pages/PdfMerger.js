import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
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

const PdfMerger = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [previewPdf, setPreviewPdf] = useState(null);

  const handlePdfDrop = (acceptedFiles) => {
    const pdfs = acceptedFiles.filter(file => file.type === 'application/pdf');
    setPdfFiles(prevFiles => [...prevFiles, ...pdfs]);
  };

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
      
      // Add copied pages to the merged PDF
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
    onDrop: handlePdfDrop,
    accept: 'application/pdf',
    multiple: true,
  });

  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    const pdfs = files.filter(file => file.type === 'application/pdf');
    setPdfFiles(prevFiles => [...prevFiles, ...pdfs]);
  };

  const handlePdfPreview = (file) => {
    setPreviewPdf(URL.createObjectURL(file));
  };

  const removePdf = (index) => {
    setPdfFiles(pdfFiles.filter((_, i) => i !== index));
    if (previewPdf === URL.createObjectURL(pdfFiles[index])) {
      setPreviewPdf(null);
    }
  };

  const handleSingleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfs = files.filter(file => file.type === 'application/pdf');
    setPdfFiles(prevFiles => [...prevFiles, ...pdfs]);
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <h1 className='text-center'>Merge PDFs Here</h1>
      <Link to="/">
        <Button variant="contained" color="primary" sx={{ marginBottom: 2 }}>
          Go Back
        </Button>
      </Link>

      <Grid container spacing={2}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ padding: 2, height: '100%' }}>
            <Typography variant="h6">Selected PDF Files:</Typography>
            <List>
              {pdfFiles.map((file, index) => (
                <ListItem key={index} secondaryAction={
                  <div className='d-flex'>
                    <IconButton onClick={() => removePdf(index)} color="secondary" style={{ width: '40px', color: '#f13e3e' }}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handlePdfPreview(file)} color="primary" style={{ width: '40px' }}>
                      <PreviewIcon />
                    </IconButton>
                  </div>
                }>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <div 
              {...getRootProps({ className: 'dropzone' })} 
              style={{ border: '2px dashed #007bff', padding: '20px', textAlign: 'center', borderRadius: '8px' }}
            >
              <input 
                {...getInputProps()} 
                onChange={handleFolderSelect} 
                webkitdirectory="" 
                directory="" 
                style={{ display: 'none' }} // Hide the default input
              />
              <Typography variant="body1">
                Drop PDF files here or <span style={{ color: '#007bff', cursor: 'pointer' }}>browse</span>
              </Typography>
              <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => document.querySelector('input[type="file"]').click()}>
                Select Folder
              </Button>
            </div>

            {/* Input for manual single PDF upload */}
            <input
              type="file"
              accept="application/pdf"
              onChange={handleSingleFileUpload}
              style={{ display: 'none' }} // Hide the default input
              id="single-upload"
            />
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => document.getElementById('single-upload').click()} 
              sx={{ marginTop: 2 }}
            >
              Add  PDF
            </Button>

            {pdfFiles.length > 1 && (
              <Button variant="contained" color="success" onClick={mergePdfs} sx={{ marginTop: 2 }}>
                Merge PDFs
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>

      {previewPdf && (
        <Box sx={{ marginTop: 2 }}>
          <iframe src={previewPdf} style={{ width: '100%', height: '60vh', border: 'none' }} title="PDF Preview"></iframe>
          <Button variant="outlined" onClick={() => setPreviewPdf(null)} sx={{ marginTop: 2 }}>
            Close Preview
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default PdfMerger;
