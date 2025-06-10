"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
}

export function ImageUpload({ onImagesChange, maxImages = 5 }: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    addImages(files);
  };

  const addImages = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const totalImages = selectedImages.length + imageFiles.length;
    
    if (totalImages > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    const newImages = [...selectedImages, ...imageFiles];
    setSelectedImages(newImages);
    onImagesChange(newImages);

    // Create preview URLs
    const newPreviewUrls = [...previewUrls];
    imageFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });
    setPreviewUrls(newPreviewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    // Cleanup URL to prevent memory leak
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedImages(newImages);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Check if device supports camera
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  return (
    <div className="space-y-4">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
        className="hidden"
        capture={isMobile ? "environment" : undefined}
      />

      {/* Main upload area */}
      <div
        onClick={openFileDialog}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
      >
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 border-2 border-gray-400 rounded-lg flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <Upload className="w-4 h-4 text-gray-600 ml-1 -mt-1" />
          </div>
          <div>
            <p className="text-sm text-gray-600 font-medium">
              Drag & Drop/Select from device
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isMobile ? "Tap to use camera or select from gallery" : "Click to browse files"}
            </p>
          </div>
        </div>
      </div>

      {/* Add Image Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={openFileDialog}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          + Add Image
        </Button>
      </div>

      {/* Selected images preview */}
      {selectedImages.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-20 h-20 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                <Upload className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
          
          {/* Add more images placeholder */}
          {selectedImages.length < maxImages && (
            <div
              onClick={openFileDialog}
              className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50"
            >
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
      )}

      {selectedImages.length > 0 && (
        <p className="text-xs text-gray-500 text-center">
          {selectedImages.length} of {maxImages} images selected
        </p>
      )}
    </div>
  );
} 