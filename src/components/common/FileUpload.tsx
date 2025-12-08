/* eslint-disable @next/next/no-img-element */
"use client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps {
  value?: string;
  className?: string;
  onFileChange: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
}) => {
  const [image, setImage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <label
        htmlFor="file-upload"
        className="border-2 border-dashed border-gray-300 p-4 text-center"
      >
        {!image ? (
          <>
            <ImageIcon className="mx-auto mb-2 h-12 w-12 text-blue-500" />
            <p className="text-sm text-gray-500">
              Note: PNG, WEBM, JPG files are allowed up to 4 MB size.
            </p>
          </>
        ) : (
          <>
            <Image
              src={image}
              alt="Preview"
              className="mx-auto mb-2 h-24 w-24"
              width={48}
              height={48}
            />
          </>
        )}
        <input
          id="file-upload"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
