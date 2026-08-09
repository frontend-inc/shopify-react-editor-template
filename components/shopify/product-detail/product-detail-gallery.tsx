'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { RiCloseLine } from '@remixicon/react';
import { Button } from '@/components/ui/button';

interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

interface ProductDetailGalleryProps {
  images: ProductImage[];
}

const ProductDetailGallery: React.FC<ProductDetailGalleryProps> = ({
  images,
}) => {
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isZoomed = zoomedIndex !== null;

  const close = useCallback(() => setZoomedIndex(null), []);

  // The slide whose left edge sits closest to the scroller's left edge is the
  // one in view. Measuring rects keeps this correct whatever the gap or width.
  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrollerLeft = scroller.getBoundingClientRect().left;
    let nearest = 0;
    let smallestOffset = Infinity;

    Array.from(scroller.children).forEach((child, index) => {
      const offset = Math.abs(child.getBoundingClientRect().left - scrollerLeft);
      if (offset < smallestOffset) {
        smallestOffset = offset;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
  }, []);

  // Touch already scrolls natively; this adds click-and-drag for pointers that
  // don't (mouse at mobile widths), suspending snap so the drag stays smooth.
  const drag = useRef<{ startX: number; startScroll: number } | null>(null);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    drag.current = { startX: event.clientX, startScroll: scroller.scrollLeft };
    scroller.style.scrollSnapType = 'none';
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!drag.current || !scroller) return;

    event.preventDefault();
    scroller.scrollLeft =
      drag.current.startScroll - (event.clientX - drag.current.startX);
  };

  const endDrag = () => {
    const scroller = scrollerRef.current;
    if (!drag.current || !scroller) return;

    drag.current = null;
    // Restoring snap lets the browser settle on the nearest slide.
    scroller.style.scrollSnapType = '';
  };

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current;
    const slide = scroller?.children[index];
    if (!scroller || !slide) return;

    const offset =
      slide.getBoundingClientRect().left - scroller.getBoundingClientRect().left;
    scroller.scrollTo({ left: scroller.scrollLeft + offset, behavior: 'smooth' });
  };

  // Close on Escape, and keep the page behind the overlay from scrolling.
  useEffect(() => {
    if (!isZoomed) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isZoomed, close]);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-zinc-50 flex items-center justify-center text-zinc-300">
        <i className="ri-image-line text-[120px]"></i>
      </div>
    );
  }

  const isSingle = images.length === 1;
  const zoomedImage = zoomedIndex !== null ? images[zoomedIndex] : null;

  return (
    <>
      {/* Swipeable carousel on mobile, grid from sm up */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto no-scrollbar touch-pan-x sm:grid sm:grid-cols-2 sm:touch-auto sm:overflow-visible"
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setZoomedIndex(index)}
            aria-label={`Zoom ${image.altText || 'product image'}`}
            className={`relative aspect-square w-full shrink-0 snap-center overflow-hidden pointer-events-none sm:pointer-events-auto sm:shrink sm:cursor-zoom-in ${
              isSingle ? 'sm:col-span-2' : ''
            }`}
          >
            <Image
              src={image.url}
              alt={image.altText || 'Product image'}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
              priority={index === 0}
              draggable={false}
              className="object-cover select-none"
            />
          </button>
        ))}
      </div>

      {/* Carousel pagination — the grid needs no dots, so mobile only */}
      {!isSingle && (
        <div className="flex justify-center gap-2 pt-4 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to image ${index + 1}`}
              aria-current={index === activeIndex}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-5 bg-foreground'
                  : 'w-1.5 bg-border hover:bg-foreground/40'
              }`}
            />
          ))}
        </div>
      )}

      {zoomedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={zoomedImage.altText || 'Product image'}
          onClick={close}
          className="fixed inset-0 z-100 flex items-center justify-center bg-foreground/20 backdrop-blur-md p-6 md:p-10"
        >
          <Image
            src={zoomedImage.url}
            alt={zoomedImage.altText || 'Product image'}
            // Shopify gives us the intrinsic size; the square fallback only
            // reserves space until CSS scales it down to fit the overlay.
            width={zoomedImage.width || 1600}
            height={zoomedImage.height || 1600}
            sizes="100vw"
            onClick={(event) => event.stopPropagation()}
            // w/h-auto keeps the box at the image's own ratio; without it the
            // width+height attributes make both axes definite and the element
            // stretches to the overlay, swallowing backdrop clicks that close it.
            className="max-h-full max-w-full w-auto h-auto object-contain"
          />

          <Button
            onClick={close}
            variant="ghost"
            size="icon-lg"
            aria-label="Close"
            className="absolute top-4 right-4 rounded-full bg-background shadow-sm hover:bg-secondary"
          >
            <RiCloseLine size={20} />
          </Button>
        </div>
      )}
    </>
  );
};

export default ProductDetailGallery;
