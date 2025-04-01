import React, { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';

interface UploadProps {
  onUploadSuccess: (url: string) => void;
  onFileChange?: (file: File | null) => void;
}

const Upload: React.FC<UploadProps> = ({ onUploadSuccess, onFileChange }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    
    // Call parent's onFileChange if provided
    if (onFileChange) {
      onFileChange(selectedFile);
    }

    // Create preview for image files
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    setIsUploading(true);
    setMessage('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/imageupload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      setMessage('Upload successful!');
      onUploadSuccess(data.fileUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-600 rounded-lg p-4">
      <div className="flex flex-col items-center justify-center">
        <UploadIcon className="w-12 h-12 text-gray-400 mb-3" />
        <h4 className="text-lg font-medium mb-2">Upload Image</h4>
        
        <div className="w-full max-w-xs">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
            accept="image/*"
          />
          <label
            htmlFor="file-input"
            className="flex items-center justify-center w-full py-2 px-4 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-600"
          >
            Choose File
          </label>
          
          {file && (
            <div className="mt-3">
              <p className="text-sm text-gray-300">{file.name}</p>
              {preview && (
                <div className="mt-2">
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded" />
                </div>
              )}
              {/* <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full mt-3 py-2 px-4 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button> */}
            </div>
          )}
          
          {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Upload;