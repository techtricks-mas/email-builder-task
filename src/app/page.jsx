"use client";
import Canvas from "@/components/Editor/canvas";
import Customizer from "@/components/Editor/customizer";
import Sidebar from "@/components/Editor/sidebar";
import { generateUUID, getLocalStorageState } from "@/utils/utils";
import { components, dropableComponent } from "@/utils/utils";
import { DragDropContext } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { IoArrowRedoOutline, IoArrowUndoOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const App = () => {
  const queryAttr = "data-rfd-drag-handle-draggable-id"; 
  const [canvasComponents, setCanvasComponents] = useState(() => getLocalStorageState("canvasComponents", []));
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [placeholderProps, setPlaceholderProps] = useState({});
  const [history, setHistory] = useState(() => getLocalStorageState("history", []));
  const [historyIndex, setHistoryIndex] = useState(() => getLocalStorageState("historyIndex", -1));

  useEffect(() => {
    localStorage.setItem("canvasComponents", JSON.stringify(canvasComponents));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("historyIndex", JSON.stringify(historyIndex));
  }, [canvasComponents, selectedComponent, history, historyIndex]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [historyIndex, history]);

  // Save current state of component to history
  const saveToHistory = (components, selected) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ components, selected });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Keyboard undo/redo handler
  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.key === 'z') {
      event.preventDefault();
      undo();
    } else if (event.ctrlKey && (event.key === 'y' || event.key === 'Z')) {
      event.preventDefault();
      redo();
    }
  };

  // Undo Handler
  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { components, selected } = history[newIndex];
      setCanvasComponents(components);
      setSelectedComponent(selected);
      setHistoryIndex(newIndex);
    }
  };

  // Redo Handler
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { components, selected } = history[newIndex];
      setCanvasComponents(components);
      setSelectedComponent(selected);
      setHistoryIndex(newIndex);
    }
  };

  // Get Dragging dom
  const getDraggedDom = (draggableId) => {
    const domQuery = `[${queryAttr}='${draggableId}']`;
    return document.querySelector(domQuery);
  };

  // Handle Drag start to manipulate preview
  const handleDragStart = (event) => {
    const draggedDOM = getDraggedDom(event.draggableId);
    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
    });
  };

  // Manipulate preview when dragging to one component to another
  const handleDragUpdate = (event) => {
    if (!event.destination) return;

    const draggedDOM = getDraggedDom(event.draggableId);
    if (!draggedDOM) return;

    const { clientHeight, clientWidth } = draggedDOM;
    const destinationIndex = event.destination.index;
    const sourceIndex = event.source.index;

    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);
    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    const clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    setPlaceholderProps({
      clientHeight,
      clientWidth,
      clientY,
      clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft),
    });
  };

  // Handle drop position and update compoenents order
  const onDragEnd = (result) => {
    setPlaceholderProps({});
    if (!result.destination) return;

    const draggableId = result.draggableId.split("_")[0];
    let updatedComponents = [...canvasComponents];

    // Adding new component to canvas
    if (result.source.droppableId === "sidebar") {
      const droppedComponent = dropableComponent.find((c) => c.id === draggableId);
      if (droppedComponent) {
        const newComponent = {
          id: droppedComponent.id + "_" + generateUUID(),
          dragId: droppedComponent.id + "_" + generateUUID(),
          componentInfo: droppedComponent.componentInfo,
          subcomponents: components
            .filter((comp) =>
              comp.componentInfo.for.toLowerCase().includes(droppedComponent.id.toLowerCase())
            )
            .map((subcomponent) => ({ ...subcomponent, id: "sub_" + generateUUID() })),
        };

        updatedComponents.splice(result.destination.index, 0, newComponent);
        saveToHistory(updatedComponents, selectedComponent);
      }
    } 
    // Parent compoenent drag and drop order
    else if (result.source.droppableId === "canvas" && result.destination.droppableId === "canvas") {
      const [movedComponent] = updatedComponents.splice(result.source.index, 1);
      updatedComponents.splice(result.destination.index, 0, movedComponent);
      saveToHistory(updatedComponents, selectedComponent);
    } 
    // Sub components drag and drop order
    else {
      const sourceParentId = result.source.droppableId;
      const destinationParentId = result.destination.droppableId;

      // If same parent component
      if (sourceParentId === destinationParentId) {
        const parentIndex = updatedComponents.findIndex((c) => c.id === sourceParentId);
        if (parentIndex !== -1) {
          const parentComponent = { ...updatedComponents[parentIndex] };
          const [movedSubcomponent] = parentComponent.subcomponents.splice(result.source.index, 1);
          parentComponent.subcomponents.splice(result.destination.index, 0, movedSubcomponent);
          updatedComponents[parentIndex] = parentComponent;
          saveToHistory(updatedComponents, selectedComponent);
        }
      } 
      // If drop into another component
      else {
        const sourceParentIndex = updatedComponents.findIndex((c) => c.id === sourceParentId);
        const destinationParentIndex = updatedComponents.findIndex((c) => c.id === destinationParentId);

        if (sourceParentIndex !== -1 && destinationParentIndex !== -1) {
          const sourceParent = { ...updatedComponents[sourceParentIndex] };
          const destinationParent = { ...updatedComponents[destinationParentIndex] };

          const [movedSubcomponent] = sourceParent.subcomponents.splice(result.source.index, 1);
          destinationParent.subcomponents.splice(result.destination.index, 0, movedSubcomponent);

          updatedComponents[sourceParentIndex] = sourceParent;
          updatedComponents[destinationParentIndex] = destinationParent;

          saveToHistory(updatedComponents, selectedComponent);
        }
      }
    }

    setCanvasComponents(updatedComponents);
  };

  // Update components style and other properties
  const updateComponent = (updatedSubcomponent) => {
    const oldComponents = [...canvasComponents];
    let update;

    if (updatedSubcomponent.subcomponents) {
      update = oldComponents.map((parentComponent) => {
        return parentComponent.id === updatedSubcomponent.id ? updatedSubcomponent : parentComponent;
      });
    } else {
      update = oldComponents.map((parentComponent) => {
        if (parentComponent.subcomponents) {
          const updatedSubcomponents = parentComponent.subcomponents.map((subcomponent) =>
            subcomponent.id === updatedSubcomponent.id ? updatedSubcomponent : subcomponent
          );
          return { ...parentComponent, subcomponents: updatedSubcomponents };
        }
        return parentComponent;
      });
    }

    saveToHistory(update, updatedSubcomponent);
    setCanvasComponents(update);
  };

  // Clear canvas and history to start again
  const deleteHandler = () => {
    localStorage.setItem("canvasComponents", JSON.stringify([]));
    localStorage.setItem("history", JSON.stringify([]));
    localStorage.setItem("historyIndex", 0);
  
    // Update the state to reflect the changes
    setCanvasComponents([]);
    setSelectedComponent(null);
    setHistory([]);
    setHistoryIndex(0);
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragUpdate={handleDragUpdate} onDragEnd={onDragEnd}>
      <div className="app">
        <div className="history-controls bg-[#0e102b] text-white py-5 text-center">
          <button
            className={`py-1 px-2 text-black rounded hover:bg-lime-500 duration-300 mr-5 ${historyIndex <= 0 ? "bg-lime-500 cursor-default" : "bg-white cursor-pointer"
              }`}
            onClick={undo}
            disabled={historyIndex <= 0}
          >
            <IoArrowUndoOutline />
          </button>
          <button
            className={`py-1 px-2 text-black rounded hover:bg-lime-500 duration-300 mr-5 cursor-pointer ${historyIndex >= history.length - 1 ? "bg-lime-500 cursor-default" : "bg-white cursor-pointer"
              }`}
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
          >
            <IoArrowRedoOutline />
          </button>
          <button
            className={`py-1 px-2 bg-white text-black rounded hover:bg-red-400 hover:text-white duration-300 cursor-pointer`}
            onClick={deleteHandler}
          >
            <MdDelete />
          </button>
        </div>
        <div className="grid grid-cols-11">
          <div className="col-span-2 relative">
            <Sidebar components={dropableComponent} />
          </div>
          <div className="col-span-7">
            <Canvas
              components={canvasComponents}
              setSelectedComponent={setSelectedComponent}
              placeholderProps={placeholderProps}
            />
          </div>
          <div className="col-span-2">
          <Customizer selectedComponent={selectedComponent} onUpdate={updateComponent} />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default App;
