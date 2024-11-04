import { Draggable, Droppable } from '@hello-pangea/dnd';
import React from 'react';
import DraggableItem from './draggableItem';
import PlaceHolderBox from './placeHolderBox';

const DroppableItem = ({ component, index, setSelectedComponent, placeholderProps }) => {
  return (
    component && (
      <Draggable draggableId={component.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setSelectedComponent(component)}
            style={{
              ...provided.draggableProps.style,
              opacity: snapshot.isDragging ? 0.5 : 1,
              padding: '8px',
              ...component.componentInfo.attributes.style
            }}
          >
            <Droppable droppableId={component.id} type="SUBCOMPONENT">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    ...component.componentInfo.attributes.style,
                    width: "100%"
                  }}
                >
                  {component.subcomponents.map((subcomponent, subIndex) => (
                    <DraggableItem
                      key={subcomponent.id}
                      item={subcomponent}
                      index={subIndex}
                      onClick={(item) => setSelectedComponent(item)}
                    />
                  ))}
                  {placeholderProps && snapshot.isDraggingOver && (
                    <PlaceHolderBox placeholderProps={placeholderProps}/>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    )
  );
};

export default DroppableItem;
