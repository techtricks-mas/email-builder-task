import { Draggable, Droppable } from '@hello-pangea/dnd';
import React from 'react';
import styled from 'styled-components';

const Sidebar = ({ components }) => (
  <Droppable droppableId="sidebar" isDropDisabled={true}>
    {(provided, snapshot) => (
      <Lists
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {components.map((item, index) => (
          <Draggable key={item.id} draggableId={item.id} index={index}>
            {(provided, snapshot) => (
              <>
                {snapshot.isDragging ?
                  <ClonedItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      height: item.componentInfo.attributes.height / 2,
                      borderRadius: item.componentInfo.attributes.style.borderRadius,
                      objectFit: item.componentInfo.attributes.style.objectFit,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.componentInfo.name}
                  </ClonedItem>
                  :
                  <Item
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      height: item.componentInfo.attributes.height / 2,
                      borderRadius: item.componentInfo.attributes.style.borderRadius,
                      objectFit: item.componentInfo.attributes.style.objectFit,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.componentInfo.name}
                  </Item>
                }
                {snapshot.isDragging && <Clone style={{
                  height: item.componentInfo.attributes.height / 2,
                  borderRadius: item.componentInfo.attributes.style.borderRadius,
                  objectFit: item.componentInfo.attributes.style.objectFit,
                  alignItems: "center",
                  justifyContent: "center",
                }}>{item.componentInfo.name}</Clone>}
              </>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </Lists>
    )}
  </Droppable>
);

export default Sidebar;

// Styled components
const List = styled.div`
  background: #fff;
  padding: 0.5rem 0.5rem 0;
  border-radius: 3px;
  flex: 0 0 150px;
  font-family: sans-serif;
  display: flex;
  justify-content: space-between;
  gap: 20px
`;

const Lists = styled(List)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #0e102b
`;

const Item = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px solid #ddd;
  width: 50%;

  &:hover {
    background: #f0f0f0;
    border-color: #bbb;
    cursor: all-scroll
  }
`;
const ClonedItem = styled.div`
  display: flex;
  user-select: none;
  padding: 0.5rem;
  margin: 0 0 0.5rem 0;
  align-items: flex-start;
  align-content: flex-start;
  line-height: 1.5;
  border-radius: 3px;
  background: #fff;
  border: 1px dashed #000;
`;

const Clone = styled(Item)`
  ~ div {
    transform: none !important;
  }
`;
