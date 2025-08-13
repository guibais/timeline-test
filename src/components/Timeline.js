import React, { useState, useRef, useCallback, useMemo } from "react";
import assignLanes from "../assignLanes.js";
import TimelineItem from "./TimelineItem.js";
import TimelineHeader from "./TimelineHeader.js";
import {
  parseDate,
  formatDate,
  getDateRange,
  getDaysBetween,
  addDays,
} from "../utils/dateUtils.js";

const Timeline = ({ items, onItemUpdate }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragType: null,
    itemId: null,
    startX: 0,
    startY: 0,
    originalStart: null,
    originalEnd: null,
    originalLane: null,
    currentLane: null,
  });

  const [itemLanes, setItemLanes] = useState({});
  
  const laneColors = [
    { name: 'Blue', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { name: 'Green', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { name: 'Orange', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { name: 'Red', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { name: 'Purple', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { name: 'Cyan', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  ];

  const timelineRef = useRef(null);

  const dateRange = useMemo(() => getDateRange(items), [items]);
  const pixelsPerDay = 20 * zoomLevel;
  const totalDays = getDaysBetween(
    formatDate(dateRange.min),
    formatDate(dateRange.max)
  );
  const timelineWidth = totalDays * pixelsPerDay;

  const lanes = useMemo(() => {
    const colorLanes = laneColors.map(() => []);
    
    items.forEach(item => {
      const laneIndex = itemLanes[item.id] || 0;
      if (laneIndex < colorLanes.length) {
        colorLanes[laneIndex].push(item);
      }
    });
    
    return colorLanes;
  }, [items, itemLanes, laneColors]);

  const getItemPosition = useCallback(
    (item) => {
      const startDate = parseDate(item.start);
      const endDate = parseDate(item.end);
      const daysFromStart =
        getDaysBetween(formatDate(dateRange.min), item.start) - 1;
      const duration = getDaysBetween(item.start, item.end);

      return {
        left: daysFromStart * pixelsPerDay,
        width: Math.max(duration * pixelsPerDay, 80),
      };
    },
    [dateRange.min, pixelsPerDay]
  );

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev * 1.5, 5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev / 1.5, 0.2));

  const getEventCoordinates = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handlePointerDown = (e, item, dragType, laneIndex) => {
    e.preventDefault();
    const coords = getEventCoordinates(e);
    setDragState({
      isDragging: true,
      dragType,
      itemId: item.id,
      startX: coords.clientX,
      startY: coords.clientY,
      originalStart: item.start,
      originalEnd: item.end,
      originalLane: laneIndex,
      currentLane: laneIndex,
    });
  };

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragState.isDragging) return;

      const coords = getEventCoordinates(e);
      const deltaX = coords.clientX - dragState.startX;
      const deltaY = coords.clientY - dragState.startY;
      const daysDelta = Math.round(deltaX / pixelsPerDay);
      const lanesDelta = Math.round(deltaY / 80);
      
      const newLane = Math.max(0, Math.min(laneColors.length - 1, dragState.originalLane + lanesDelta));
      
      if (dragState.dragType === 'move' && newLane !== dragState.currentLane) {
        setDragState(prev => ({ ...prev, currentLane: newLane }));
      }

      if (daysDelta === 0 && dragState.dragType !== 'move') return;

      const originalStart = parseDate(dragState.originalStart);
      const originalEnd = parseDate(dragState.originalEnd);

      let newStart, newEnd;

      const dragTypeActions = {
        move: () => {
          newStart = addDays(originalStart, daysDelta);
          newEnd = addDays(originalEnd, daysDelta);
        },
        "resize-start": () => {
          newStart = addDays(originalStart, daysDelta);
          newEnd = originalEnd;
          if (newStart >= newEnd) {
            newStart = addDays(newEnd, -1);
          }
        },
        "resize-end": () => {
          newStart = originalStart;
          newEnd = addDays(originalEnd, daysDelta);
          if (newEnd <= newStart) {
            newEnd = addDays(newStart, 1);
          }
        },
      };

      const action = dragTypeActions[dragState.dragType];
      if (action) {
        action();

        const updatedItem = {
          ...items.find((item) => item.id === dragState.itemId),
          start: formatDate(newStart),
          end: formatDate(newEnd),
        };

        onItemUpdate(updatedItem);
      }
    },
    [dragState, pixelsPerDay, items, onItemUpdate, laneColors.length]
  );

  const handlePointerUp = useCallback(() => {
    if (dragState.isDragging && dragState.dragType === 'move' && dragState.currentLane !== dragState.originalLane) {
      setItemLanes(prev => ({ ...prev, [dragState.itemId]: dragState.currentLane }));
    }
    
    setDragState({
      isDragging: false,
      dragType: null,
      itemId: null,
      startX: 0,
      startY: 0,
      originalStart: null,
      originalEnd: null,
      originalLane: null,
      currentLane: null,
    });
  }, [dragState]);

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener("mousemove", handlePointerMove, { passive: false });
      document.addEventListener("mouseup", handlePointerUp);
      document.addEventListener("touchmove", handlePointerMove, { passive: false });
      document.addEventListener("touchend", handlePointerUp);
      document.addEventListener("touchcancel", handlePointerUp);
      
      return () => {
        document.removeEventListener("mousemove", handlePointerMove);
        document.removeEventListener("mouseup", handlePointerUp);
        document.removeEventListener("touchmove", handlePointerMove);
        document.removeEventListener("touchend", handlePointerUp);
        document.removeEventListener("touchcancel", handlePointerUp);
      };
    }
  }, [dragState.isDragging, handlePointerMove, handlePointerUp]);

  return (
    <div className="timeline-container">
      <div className="timeline-controls">
        <button onClick={handleZoomOut} className="zoom-btn">
          Zoom Out
        </button>
        <span className="zoom-level">Zoom: {Math.round(zoomLevel * 100)}%</span>
        <button onClick={handleZoomIn} className="zoom-btn">
          Zoom In
        </button>
      </div>

      <div className="timeline-wrapper" ref={timelineRef}>
        <TimelineHeader
          dateRange={dateRange}
          pixelsPerDay={pixelsPerDay}
          totalDays={totalDays}
        />

        <div className="timeline-lanes" style={{ width: timelineWidth }}>
          {lanes.map((lane, laneIndex) => (
            <div 
              key={laneIndex} 
              className={`timeline-lane color-lane-${laneIndex}`}
              style={{ '--lane-color': laneColors[laneIndex].gradient }}
            >
              <div className="lane-label">
                {laneColors[laneIndex].name}
              </div>
              {lane.map((item) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  position={getItemPosition(item)}
                  onPointerDown={(e, item, dragType) => handlePointerDown(e, item, dragType, laneIndex)}
                  onItemUpdate={onItemUpdate}
                  isDragging={
                    dragState.isDragging && dragState.itemId === item.id
                  }
                  laneColor={laneColors[laneIndex].gradient}
                />
              ))}
            </div>
          ))}
          {dragState.isDragging && dragState.dragType === 'move' && (
            <div 
              className="lane-drop-indicator"
              style={{
                top: dragState.currentLane * 80,
                width: timelineWidth,
                height: 70,
                background: laneColors[dragState.currentLane]?.gradient || 'rgba(59, 130, 246, 0.2)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
