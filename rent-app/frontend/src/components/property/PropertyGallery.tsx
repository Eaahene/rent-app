'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Image as ImageType } from '@/types';

interface PropertyGalleryProps {
  images: ImageType[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images.length) {
    return (
      <div className="aspect-video bg-muted flex items-center justify-center rounded-lg">
        <span className="text-muted-foreground">No images available</span>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative cursor-pointer overflow-hidden rounded-lg ${
              index === 0 ? 'col-span-2 row-span-2' : ''
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <div className={`relative ${index === 0 ? 'aspect-square' : 'aspect-square'}`}>
              <Image
                src={image.url}
                alt={`Property image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {index === 3 && images.length > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">+{images.length - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black">
          {selectedImage !== null && (
            <div className="relative aspect-video">
              <Image
                src={images[selectedImage].url}
                alt={`Property image ${selectedImage + 1}`}
                fill
                className="object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === selectedImage ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
