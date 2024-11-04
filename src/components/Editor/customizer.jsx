import { rgbToHex } from '@/utils/utils';
import React, { useEffect, useState } from 'react';

const fontOptions = [
  { value: '', label: 'Select Font Family' },
  { value: 'geistSans', label: 'Geist Sans' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Verdana', label: 'Verdana' },
];

const Customizer = ({ selectedComponent, onUpdate }) => {
  const [properties, setProperties] = useState({
    textContent: '',
    fontSize: '',
    fontColor: '',
    backgroundColor: '',
    fontFamily: '',
    textAlign: 'left',
    link: '',
    height: '',
    width: '',
    margin: '',
  });

  useEffect(() => {
    if (selectedComponent) {
      const { componentInfo } = selectedComponent;
      setProperties({
        textContent: componentInfo.value || '',
        fontSize: componentInfo.attributes.style.fontSize || '',
        fontColor: convertToHexIfNeeded(componentInfo.attributes.style.color),
        backgroundColor: convertToHexIfNeeded(componentInfo.attributes.style.backgroundColor),
        fontFamily: componentInfo.attributes.style.fontFamily || '',
        textAlign: componentInfo.attributes.style.textAlign || 'left',
        link: componentInfo.href || '',
        height: componentInfo.attributes.style.height || '',
        width: componentInfo.attributes.style.width || '',
        margin: componentInfo.attributes.style.margin || '',
      });
    }
  }, [selectedComponent]);

  const convertToHexIfNeeded = (color) => {
    if (color && color.startsWith('rgb')) {
      const rgbValues = color.match(/\d+/g);
      if (rgbValues && rgbValues.length === 3) {
        return rgbToHex(Number(rgbValues[0]), Number(rgbValues[1]), Number(rgbValues[2]));
      }
    }
    return color || '';
  };

  // Property change handler
  const handleChange = (property, value) => {
    console.log(property, value);
    
    const updatedProperties = { ...properties, [property]: value };
    setProperties(updatedProperties);

    const height = updatedProperties.height !== 'auto' ? updatedProperties.height : 'auto';
    const width = updatedProperties.width ? updatedProperties.width : 'auto';
    const margin = updatedProperties.margin === 'auto' ? 'auto' : updatedProperties.margin;
    const fontSize = updatedProperties.fontSize ? updatedProperties.fontSize : 'initial';
    
    
    const updatedComponent = {
      ...selectedComponent,
      componentInfo: {
        ...selectedComponent.componentInfo,
        value: updatedProperties.textContent,
        attributes: {
          ...selectedComponent.componentInfo.attributes,
          style: {
            ...selectedComponent.componentInfo.attributes.style,
            fontSize: fontSize,
            color: updatedProperties.fontColor,
            backgroundColor: updatedProperties.backgroundColor,
            fontFamily: updatedProperties.fontFamily,
            textAlign: updatedProperties.textAlign,
            height,
            width,
          },
        },
      },
    };

    if (selectedComponent.componentInfo.type === 'button') {
      updatedComponent.componentInfo.href = updatedProperties.link;
    }

    if (selectedComponent && selectedComponent.subcomponents) {
      updatedComponent.componentInfo.attributes.style.margin = margin;
    }

    onUpdate(updatedComponent);
  };

  const isParentComponent = selectedComponent && selectedComponent.subcomponents ? true : false;

  return (
    selectedComponent && (
      <div className="customizer p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          Customizer for {selectedComponent.subcomponents ? 'Product' : selectedComponent ? selectedComponent.componentInfo.type : ''}
        </h3>
        {selectedComponent && !selectedComponent.subcomponents &&
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Text Content</label>
            <input
              type="text"
              value={properties.textContent}
              onChange={(e) => handleChange('textContent', e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="Enter text content"
            />
          </div>
        }
        {isParentComponent && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Height</label>
              <input
                type="number"
                value={properties.height}
                onChange={(e) => handleChange('height', Number(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Enter height (e.g., 200)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Width</label>
              <input
                type="number"
                value={properties.width}
                onChange={(e) => handleChange('width', Number(e.target.value))}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Enter width (e.g., 300)"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Margin</label>
              <input
                type="text"
                value={properties.margin}
                onChange={(e) => handleChange('margin', !isNaN(e.target.value) && e.target.value.trim() !== '' ? Number(e.target.value) : 'auto')}
                className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                placeholder="Enter margin (e.g., auto or 20)"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Font Size</label>
          <input
            type="number"
            value={properties.fontSize && properties.fontSize !== 'initial' ? properties.fontSize : ""}
            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
            placeholder="Enter font size (e.g., 16)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Font Family</label>
          <select
            value={properties.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Text Alignment</label>
          <select
            value={properties.textAlign}
            onChange={(e) => handleChange('textAlign', e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Font Color</label>
          <input
            type="color"
            value={properties.fontColor ? properties.fontColor : '#ffffff'}
            onChange={(e) => handleChange('fontColor', e.target.value)}
            className="mt-1 w-full h-10 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Background Color</label>
          <input
            type="color"
            value={properties.backgroundColor ? properties.backgroundColor : "#ffffff"}
            onChange={(e) => handleChange('backgroundColor', e.target.value)}
            className="mt-1 w-full h-10 border border-gray-300 rounded-md focus:ring-blue-500"
          />
        </div>
        {selectedComponent?.componentInfo.type === 'button' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Link</label>
            <input
              type="text"
              value={properties.link}
              onChange={(e) => handleChange('link', e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
              placeholder="Enter link URL"
            />
          </div>
        )}
      </div>
    )
  );
};

export default Customizer;
