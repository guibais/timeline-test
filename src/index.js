import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import timelineItems from "./timelineItems.js";
import Timeline from "./components/Timeline.js";

const App = () => {
  const [items, setItems] = useState(timelineItems);

  const handleItemUpdate = (updatedItem) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Timeline Visualization</h1>
        <p>Interactive timeline with {items.length} items</p>
      </header>
      <Timeline items={items} onItemUpdate={handleItemUpdate} />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);