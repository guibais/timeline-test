const assignLanes = (items) => {
  const sortedItems = [...items].sort((a, b) => new Date(a.start) - new Date(b.start));
  const lanes = [];

  const assignItemToLane = (item) => {
    for (const lane of lanes) {
      const lastItem = lane[lane.length - 1];
      if (new Date(lastItem.end) < new Date(item.start)) {
        lane.push(item);
        return;
      }
    }
    lanes.push([item]);
  };

  sortedItems.forEach(assignItemToLane);
  return lanes;
};

export default assignLanes;
