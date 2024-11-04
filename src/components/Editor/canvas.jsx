import { Droppable } from '@hello-pangea/dnd';
import React from 'react';
import DroppableItem from './droppableItem';
import PlaceHolderBox from './placeHolderBox';

const Canvas = ({ components, setSelectedComponent, placeholderProps }) => {
  return (
    <Droppable droppableId="canvas" direction="vertical">
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="canvas"
          style={{
            border: '2px dashed #ccc',
            height: '90vh',
            overflow: "auto",
            padding: '16px',
            position: 'relative',
          }}
        >
          {components.map((component, index) =>
            <div {...provided.draggableProps}
              {...provided.dragHandleProps}
              key={component.id}>
              <DroppableItem
                component={component}
                index={index}
                setSelectedComponent={setSelectedComponent}
                placeholderProps={placeholderProps}
              />
            </div>
          )
          }

          {placeholderProps && snapshot.isDraggingOver && (
            <PlaceHolderBox placeholderProps={placeholderProps}/>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};


export default Canvas;
