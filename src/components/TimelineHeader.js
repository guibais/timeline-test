import React from 'react';
import { formatDate, formatDateForDisplay, formatDateWithYear, addDays } from '../utils/dateUtils.js';

const TimelineHeader = ({ dateRange, pixelsPerDay, totalDays }) => {
  const generateDateMarkers = () => {
    const markers = [];
    const startDate = dateRange.min;
    
    const getInterval = () => {
      if (pixelsPerDay < 15) return 14;
      if (pixelsPerDay < 25) return 7;
      if (pixelsPerDay < 40) return 3;
      return 1;
    };
    
    const interval = getInterval();
    const showYear = totalDays > 365;
    
    for (let i = 0; i <= totalDays; i += interval) {
      const currentDate = addDays(startDate, i);
      const position = i * pixelsPerDay;
      const isFirstOfMonth = currentDate.getDate() === 1;
      
      markers.push(
        <div
          key={i}
          className={`date-marker ${isFirstOfMonth ? 'first-of-month' : ''}`}
          style={{ left: position }}
        >
          <div className={`date-line ${isFirstOfMonth ? 'major' : ''}`} />
          <div className="date-label">
            {showYear ? formatDateWithYear(currentDate) : formatDateForDisplay(currentDate)}
          </div>
        </div>
      );
    }
    
    return markers;
  };

  return (
    <div className="timeline-header" style={{ width: totalDays * pixelsPerDay }}>
      {generateDateMarkers()}
    </div>
  );
};

export default TimelineHeader;
