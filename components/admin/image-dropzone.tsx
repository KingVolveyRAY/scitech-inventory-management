"use client";

import { Upload, X } from "lucide-react";
import { useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageDropzone({
  onFileChange,
  onError
}: {
  onFileChange: (file: File | null) => void;
  onError?: (message: string) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (file: File | null) => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setPreview(null);
        onFileChange(null);
        onError?.("Gunakan file JPG, PNG, atau WEBP.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setPreview(null);
        onFileChange(null);
        onError?.("Ukuran gambar maksimal 2MB.");
        return;
      }

      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  if (preview) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={() => handleChange(null)}
          className="absolute right-2 top-2 rounded-full bg-slate-900/50 p-1.5 text-white backdrop-blur-sm transition hover:bg-slate-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500 transition hover:border-slate-400 hover:bg-slate-100">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        <Upload className="h-5 w-5 text-slate-400" />
      </div>
      <p className="font-medium text-slate-900">Klik untuk unggah gambar</p>
      <p className="mt-1 text-xs">PNG, JPG atau WEBP (Maks. 2MB)</p>
      <input
        className="hidden"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => handleChange(event.target.files?.[0] ?? null)}
      />
    </label>
  );
}
