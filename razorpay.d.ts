export {}; 

declare global {
  interface Window {
    Razorpay: any;
  }
}

declare module 'pdfjs-dist/build/pdf.worker.entry';
