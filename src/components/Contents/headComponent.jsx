import React from 'react';

const HeadingComponent = React.forwardRef(({ as: Tag, value, style, ...otherProps }, ref) => {
  return (
    <Tag
      ref={ref}
      style={style}
      {...otherProps}
      className="heading-component"
    >
      {value}
    </Tag>
  );
});

export default HeadingComponent;
