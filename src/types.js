export const TimelineItemType = {
  id: "number",
  start: "string",
  end: "string",
  name: "string",
};

export const TimelineConfigType = {
  zoomLevel: "number",
  startDate: "Date",
  endDate: "Date",
  pixelsPerDay: "number",
};

export const DragStateType = {
  isDragging: "boolean",
  dragType: "string",
  itemId: "number",
  startX: "number",
  originalStart: "string",
  originalEnd: "string",
};
