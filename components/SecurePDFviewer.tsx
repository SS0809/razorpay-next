'use client';
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set PDF.js worker source
pdfjs.GlobalWorkerOptions.workerSrc = 
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs';

const SecurePdfViewer: React.FC = () => {
  const [numPages, setNumPages] = useState<number | undefined>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFile, setPdfFile] = useState<string | File>('/pdf.pdf');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('PDF File path:', pdfFile);
  }, [pdfFile]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log('PDF Loaded Successfully, Total Pages:', numPages);
    setNumPages(numPages);
    setError(null);
  }

  function onDocumentLoadError(error: any) {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. Please check the file path and permissions.');
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}

      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
      >
        {numPages && (
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        )}
      </Document>

      {numPages && (
        <div className="mt-4 flex items-center space-x-4">
          <p>Page {pageNumber} of {numPages}</p>
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPageNumber((prev) => (numPages && prev < numPages ? prev + 1 : prev))}
            disabled={!numPages || pageNumber >= numPages}
            className="px-2 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SecurePdfViewer;