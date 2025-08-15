'use client';

import { useState } from 'react';

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  fallbackSrc = "/placeholder-product.svg",
  style = {},
  ...props 
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined' || imageUrl.trim() === '') {
      return fallbackSrc;
    }
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:8000${imageUrl}`;
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={getImageUrl(imgSrc)}
      alt={alt || 'Product Image'}
      className={className}
      style={style}
      onError={handleError}
      {...props}
    />
  );
}
