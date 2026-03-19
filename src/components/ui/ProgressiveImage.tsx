import { useState, useEffect } from 'react';

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  placeholder: string;
}

export default function ProgressiveImage({ src, placeholder, className, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      {...props}
      src={currentSrc}
      className={`${className} transition-all duration-700 ${isLoaded ? 'blur-0 scale-100' : 'blur-lg scale-110'}`}
    />
  );
}