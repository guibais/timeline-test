# Timeline Visualization Component

🚀 **Live Demo**: [https://timeline-test-bco.pages.dev](https://timeline-test-bco.pages.dev)

An interactive timeline component built with React that visualizes items in horizontal lanes with drag-and-drop functionality, zooming, and inline editing capabilities.

## Features

- **Compact Lane Assignment**: Items are efficiently organized in horizontal lanes using a space-efficient algorithm
- **Interactive Drag & Drop**: Move items or resize their duration by dragging
- **Zoom Controls**: Zoom in/out to view different time scales
- **Inline Editing**: Double-click item names to edit them directly
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Getting Started

1. Navigate to the project directory
2. Run `npm install` to install dependencies
3. Run `npm start` to start the development server
4. The timeline will open in your default browser

### What I Like About This Implementation

- **Clean Architecture**: The code is organized into reusable components with clear separation of concerns
- **Performance Optimized**: Uses React hooks like `useMemo` and `useCallback` to prevent unnecessary re-renders
- **User Experience**: Smooth animations, visual feedback during interactions, and intuitive controls
- **Accessibility**: Keyboard navigation support and proper ARIA labels
- **Responsive**: Adapts to different screen sizes with mobile-friendly controls

### What I Would Change If Doing It Again

- **Virtual Scrolling**: For large datasets, implement virtual scrolling to handle thousands of items
- **Better Date Handling**: Use a more robust date library like date-fns for better timezone and locale support
- **Undo/Redo**: Add command pattern for undo/redo functionality
- **Keyboard Shortcuts**: Implement keyboard shortcuts for common actions
- **Data Persistence**: Add local storage or backend integration to save changes
- **Testing**: Add comprehensive unit and integration tests

### Design Decisions

- **Lane Assignment Algorithm**: Used the provided `assignLanes.js` as a starting point but enhanced it with better sorting and conflict resolution
- **Color Coding**: Applied different gradient colors to items using CSS nth-child selectors for visual distinction
- **Drag Interaction**: Implemented three drag modes (move, resize-start, resize-end) with visual feedback
- **Date Display**: Chose to show both start and end dates on items for clarity
- **Zoom Implementation**: Used pixel-per-day scaling for smooth zoom transitions

### Inspiration Sources

- **Google Calendar**: Timeline view and drag-and-drop interactions
- **Gantt Charts**: Lane-based layout and item positioning
- **Figma**: Smooth animations and modern UI design patterns
- **GitHub**: Clean, professional styling and color schemes

If I had more time, I would implement:

- Unit Tests
- Integration Tests
- E2E Tests
- **Multi-select**: Select and move multiple items at once
- **Grouping**: Group related items with visual indicators
- **Export**: Export timeline as image or PDF
- **Templates**: Save and load timeline templates
- **Collaboration**: Real-time collaborative editing
- **Custom Fields**: Add custom metadata to timeline items

## Performance Considerations

- Efficient re-rendering with React hooks
- CSS transforms for smooth animations
- Debounced drag events to prevent excessive updates
- Optimized date calculations
