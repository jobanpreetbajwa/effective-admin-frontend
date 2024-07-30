import { DragDropContext, Droppable } from "react-beautiful-dnd";

const DragDrop = ({ moveItem, children }) => {
	return (
		<DragDropContext onDragEnd={moveItem}>
			<Droppable droppableId="product-list">
				{(provided) => (
					<div
						className="max-h-[86vh] overflow-auto bg-slate-100"
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						{children}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default DragDrop;
