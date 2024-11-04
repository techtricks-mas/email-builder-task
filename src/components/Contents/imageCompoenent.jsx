import React from 'react';

const ImageComponent = React.forwardRef(({ src, alt, style, ...otherProps }, ref) => {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      style={style}
      {...otherProps}
      className="image-component"
    />
  );
});

export default ImageComponent;
