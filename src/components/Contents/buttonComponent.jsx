import React from 'react';

const ButtonComponent = React.forwardRef(({ href, value, style, onClick, ...otherProps }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      style={{ ...style, display: "inline-block" }}
      onClick={onClick}
      {...otherProps}
      className="button-component"
    >
      {value}
    </a>
  );
});

export default ButtonComponent;
