import React from 'react';
import { Droppable, DroppableProvided } from 'react-beautiful-dnd';
import DraggableItem from './DraggableItem';

interface DroppableColumnProps {
  column: {
    id: string;
    title: string;
    items: {
      id: string;
      content: React.ReactNode;
    }[];
  };
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ column }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h3 className="font-bold mb-4">{column.title}</h3>
      <Droppable droppableId={column.id}>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="min-h-[100px]"
          >
            {column.items.map((item, index) => (
              <DraggableItem key={item.id} item={item} index={index} />
            ))}
            {provided.placeholder}
            {column.items.length === 0 && (
              <div className="text-center text-gray-400 p-4">
                Drop components here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default DroppableColumn;
