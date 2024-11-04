import React from 'react';

const TextComponent = React.forwardRef(({ value, style, ...otherProps }, ref) => {
  return (
    <p
      ref={ref}
      style={style}
      {...otherProps}
      className="text-component"
    >
      {value}
    </p>
  );
});

export default TextComponent;
