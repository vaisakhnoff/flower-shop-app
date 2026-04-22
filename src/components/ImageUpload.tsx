import { useState, useRef } from 'react';
import ImageCropModal from './ImageCropModal';

interface ImageUploadProps {
  onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Step 1: User picks a file → show crop modal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPendingImageSrc(objectUrl);

    // Reset input so the same file can be re-selected later
    if (inputRef.current) inputRef.current.value = '';
  };

  // Step 2: User finished cropping → upload blob to Cloudinary
  const handleCropComplete = async (croppedBlob: Blob) => {
    setPendingImageSrc(prev => { URL.revokeObjectURL(prev ?? ''); return null; });
    setUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      console.error('Cloudinary keys are missing in .env.local');
      alert('Upload setup is incomplete. Check console for details.');
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', croppedBlob, 'cropped.jpg');
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleCropCancel = () => {
    setPendingImageSrc(prev => { URL.revokeObjectURL(prev ?? ''); return null; });
  };

  return (
    <>
      {/* Crop modal */}
      {pendingImageSrc && (
        <ImageCropModal
          imageSrc={pendingImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      {/* Drop zone */}
      <div className="w-full">
        <label className="
          flex flex-col items-center justify-center
          w-full h-32
          border-2 border-dashed rounded-lg
          cursor-pointer transition-all
          border-gray-300 bg-gray-50 hover:bg-teal-50 hover:border-teal-400
        ">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-7 h-7 animate-spin text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span className="text-sm text-teal-600 font-medium animate-pulse">Uploading…</span>
              </div>
            ) : (
              <>
                <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-semibold text-teal-600">Click to upload</span>
                </p>
                <p className="text-xs text-gray-400">Image will be cropped before uploading</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            disabled={uploading}
          />
        </label>
      </div>
    </>
  );
}