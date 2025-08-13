import React, { useState } from 'react';

const TimelineItem = ({ item, position, onPointerDown, onItemUpdate, isDragging, laneColor }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);

  const handleNameDoubleClick = () => {
    setIsEditing(true);
    setEditName(item.name);
  };

  const handleNameSubmit = () => {
    if (editName.trim() && editName !== item.name) {
      onItemUpdate({ ...item, name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setEditName(item.name);
      setIsEditing(false);
    }
  };

  return (
    <div
      className={`timeline-item ${isDragging ? 'dragging' : ''}`}
      style={{
        left: position.left,
        width: position.width,
        background: laneColor,
      }}
      onMouseDown={(e) => onPointerDown(e, item, 'move')}
      onTouchStart={(e) => onPointerDown(e, item, 'move')}
    >
      <div
        className="resize-handle resize-start"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPointerDown(e, item, 'resize-start');
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onPointerDown(e, item, 'resize-start');
        }}
      />
      
      <div className="item-content">
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyPress}
            className="item-name-input"
            autoFocus
          />
        ) : (
          <span
            className="item-name"
            onDoubleClick={handleNameDoubleClick}
            title={`${item.name} (${item.start} to ${item.end})`}
          >
            {item.name}
          </span>
        )}
        <div className="item-dates">
          {item.start} - {item.end}
        </div>
      </div>
      
      <div
        className="resize-handle resize-end"
        onMouseDown={(e) => {
          e.stopPropagation();
          onPointerDown(e, item, 'resize-end');
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          onPointerDown(e, item, 'resize-end');
        }}
      />
    </div>
  );
};

export default TimelineItem;
