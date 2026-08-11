'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { createClient } from '@/lib/supabase/browser';

type FeaturedImageFieldProps = {
  initialImage?: string | null;
  kind: 'service' | 'project' | 'blog';
  initialGallery?: string[] | null;
};

export function FeaturedImageField({ initialImage, kind }: FeaturedImageFieldProps) {
  const bucket = kind === 'blog' ? 'blog' : kind === 'service' ? 'services' : 'projects';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isNewFile, setIsNewFile] = useState(false);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Determine initial image URL from Supabase storage or static path
  useEffect(() => {
    if (initialImage) {
      if (initialImage.startsWith('http://') || initialImage.startsWith('https://') || initialImage.startsWith('/')) {
        setPreviewUrl(initialImage);
      } else {
        const supabase = createClient();
        const publicUrl = supabase.storage.from(bucket).getPublicUrl(initialImage).data.publicUrl;
        setPreviewUrl(publicUrl);
      }
    }
  }, [initialImage, bucket]);

  // Handle single feature image file select
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsNewFile(true);
    }
  };

  // Handle gallery files select
  const handleGalleryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const urls = Array.from(files).map((f) => URL.createObjectURL(f));
      setGalleryPreviews(urls);
    }
  };

  // Clear selected cover image
  const clearCoverImage = () => {
    setPreviewUrl(null);
    setIsNewFile(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="wp-sidebar-box">
      <div className="wp-sidebar-header">
        <h3>Featured Image</h3>
        {previewUrl && (
          <span className={`wp-status-badge ${isNewFile ? 'is-new' : 'is-published'}`}>
            {isNewFile ? 'New (Unsaved)' : 'Saved Cover'}
          </span>
        )}
      </div>

      <div className="wp-sidebar-body">
        {/* Live Preview Container */}
        {previewUrl ? (
          <div className="feat-img-card">
            <div className="feat-img-wrapper" onClick={() => setModalImage(previewUrl)}>
              <img src={previewUrl} alt="Cover preview" className="feat-img-element" />
              <div className="feat-img-overlay">
                <span>🔍 View Full Resolution</span>
              </div>
            </div>
            <div className="feat-img-actions">
              <button
                type="button"
                className="feat-btn feat-btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                🔄 Replace Image
              </button>
              <button
                type="button"
                className="feat-btn feat-btn-danger"
                onClick={clearCoverImage}
              >
                🗑️ Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="feat-img-dropzone" onClick={() => fileInputRef.current?.click()}>
            <span className="feat-dropzone-icon">📷</span>
            <p className="feat-dropzone-title">Click to upload cover image</p>
            <small className="feat-dropzone-hint">JPG, PNG or WebP up to 10 MB</small>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          name="cover_image"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="sr-only"
        />

        {/* Gallery Upload Section for Services & Projects */}
        {kind !== 'blog' && (
          <div className="wp-field-group wp-gallery-group pt-3 border-t border-slate-100">
            <label className="wp-label font-bold text-slate-700 flex justify-between items-center">
              <span>Gallery Photos</span>
              <button
                type="button"
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold cursor-pointer"
                onClick={() => galleryInputRef.current?.click()}
              >
                + Add Photos
              </button>
            </label>

            {/* Gallery Live Previews */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 my-2">
                {galleryPreviews.map((url, idx) => (
                  <div key={idx} className="relative aspect-video rounded overflow-hidden border border-slate-200 bg-black/10">
                    <img src={url} alt={`Gallery preview ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white text-center py-0.5 font-bold">New</span>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={galleryInputRef}
              type="file"
              name="gallery_images"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleGalleryChange}
              className="wp-file-input"
            />
            <small className="wp-hint">Upload extra photos for detail slider</small>
          </div>
        )}
      </div>

      {/* Full Resolution Modal */}
      {modalImage && (
        <div className="feat-modal-backdrop" onClick={() => setModalImage(null)}>
          <div className="feat-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Full cover preview" className="feat-modal-img" />
            <button type="button" className="feat-modal-close" onClick={() => setModalImage(null)}>
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
