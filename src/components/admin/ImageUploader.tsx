import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';
import { Upload, X, Check, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  folder: 'news' | 'gallery' | 'team';
  currentImageUrl?: string;
}

export function ImageUploader({ onUploadComplete, folder, currentImageUrl }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [stats, setStats] = useState<{ original: string; compressed: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadImage = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('El archivo es demasiado grande (máx. 10MB)');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      // Compression & Conversion to WebP
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: 'image/webp'
      };

      const compressedFile = await imageCompression(file, options);
      setStats({
        original: formatSize(file.size),
        compressed: formatSize(compressedFile.size)
      });
      setProgress(40);

      // Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('media')
        .upload(filePath, compressedFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      setProgress(90);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
      setProgress(100);
    } catch (err: any) {
      console.error('Error uploading:', err);
      setError('Error al subir la imagen. Verifica el bucket "media" en Supabase.');
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadImage(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false
  });

  // Handle paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const item = e.clipboardData?.items[0];
      if (item?.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) uploadImage(file);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Preview" width={400} height={160} className="h-40 w-full object-cover rounded-xl shadow-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-xl">
              <span className="text-white text-xs font-bold">Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <Upload size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-300">Sube una imagen</p>
              <p className="text-xs text-slate-500 mt-1">Arrastra, selecciona o pega (Ctrl+V)</p>
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-slate-950/80 rounded-2xl flex flex-col items-center justify-center p-6 space-y-3 z-10">
            <Loader2 className="animate-spin text-primary" size={32} />
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-black text-primary uppercase tracking-widest">{progress}% Subiendo...</span>
          </div>
        )}
      </div>

      {stats && !uploading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-fade-up">
          <Check size={14} className="text-emerald-400" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
            Conversión WebP: {stats.original} → {stats.compressed} ✓
          </span>
        </div>
      )}

      {error && (
        <div className="text-xs font-bold text-red-400 px-1 italic">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
