import { Draggable } from '@hello-pangea/dnd';
import React from 'react';
import ImageComponent from './../Contents/imageCompoenent';
import TextComponent from './../Contents/textComponent';
import HeadingComponent from './../Contents/headComponent';
import ButtonComponent from './../Contents/buttonComponent';

const DraggableItem = ({ item, index, onClick }) => {
  const renderContent = (providedProps) => {
    const { type, src, alt, value, as, href, attributes } = item.componentInfo;
    const { style: draggableStyle, onClick, ...otherProps } = providedProps;

    const componentStyle = { ...attributes.style, ...draggableStyle, };
    
    switch (type) {
      case 'image':
        return <ImageComponent onClick={onClick} {...otherProps} src={src} alt={alt} style={componentStyle} />;
      
      case 'text':
        return <TextComponent onClick={onClick} {...otherProps} value={value} style={componentStyle} />;
      
      case 'heading':
        return <HeadingComponent onClick={onClick} {...otherProps} as={as} value={value} style={componentStyle} />;
      
      case 'button':
        return (
          <ButtonComponent
            {...otherProps}
            href={href}
            value={value}
            style={componentStyle}
            onClick={(e) => {e.preventDefault(); onClick(e)}}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        const draggableProps = {
          ref: provided.innerRef,
          ...provided.draggableProps,
          ...provided.dragHandleProps,
          onClick: (e) => {
            e.stopPropagation();
            onClick(item);
          },
          style: {
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
            padding: '8px',
            margin: '4px 0',
            cursor: snapshot.isDragging ? "grabbing" : "default",
            height: item.componentInfo.attributes.height || '',
            ...item.componentInfo.attributes.style,
          },
        };
        return renderContent(draggableProps);
      }}
    </Draggable>
  );
};

export default DraggableItem;
