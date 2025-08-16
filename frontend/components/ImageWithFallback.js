'use client';

import { useState } from 'react';
import { getMediaUrl } from '../utils/apiConfig';

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
    return getMediaUrl(imageUrl);
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
