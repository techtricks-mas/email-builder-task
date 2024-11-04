import React from 'react'

const PlaceHolderBox = ({placeholderProps}) => {
    return (
        <div
            className="absolute flex items-center justify-center text-gray-500 text-lg font-semibold bg-white bg-opacity-70"
            style={{
                border: '2px dashed #aaa',
                padding: '10px',
                marginBottom: 8,
                pointerEvents: 'none',
                top: placeholderProps.clientY,
                left: placeholderProps.clientX,
                height: placeholderProps.clientHeight,
                width: placeholderProps.clientWidth
            }}
        >
            Drop here
        </div>
    )
}

export default PlaceHolderBox