import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface DraggableItemProps {
  item: {
    id: string;
    content: React.ReactNode;
  };
  index: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item, index }) => {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-2 mb-2 bg-white border rounded-md"
        >
          {item.content}
        </div>
      )}
    </Draggable>
  );
};

export default DraggableItem;
