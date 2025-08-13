import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import Timeline from "./components/Timeline.js";
import GuidedTour from "./components/GuidedTour.js";

const App = () => {
  const [items, setItems] = useState(timelineItems);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const tourCompleted = localStorage.getItem('timeline-tour-completed');
    if (!tourCompleted) {
      setTimeout(() => setShowTour(true), 1000);
    }
  }, []);

  const handleItemUpdate = (updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  const startTour = () => {
    setShowTour(true);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Timeline Visualization</h1>
        <p>Interactive timeline with {items.length} items</p>
        <button className="tour-trigger" onClick={startTour}>
          📖 Take Tour
        </button>
      </header>
      <Timeline items={items} onItemUpdate={handleItemUpdate} />
      <GuidedTour 
        isActive={showTour} 
        onComplete={handleTourComplete}
      />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);