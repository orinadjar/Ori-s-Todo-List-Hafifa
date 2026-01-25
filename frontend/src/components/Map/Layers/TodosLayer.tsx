import GeoJsonLayer from "./GeoJsonLayer"

import completedIcon from '../../../assets/green-selector-icon.png';
import unCompletedIcon from '../../../assets/selector-icon.png';

import { useTodos } from "../../../hooks/useTodos";

const TodosLayer = () => {

    const { todos } = useTodos();

    todos.map((todo) => console.log(todo));

    const todosGeoJson = {
        type: 'FeatureCollection',
        features: todos.map(todo => ({
            type: 'Feature',
            geometry: {
                type: todo.geometryType === 'Point' ? 'Point' : 'Polygon',
                coordinates: todo.lat !== 0 && todo.lng !== 0 ? [todo.lat, todo.lng] : todo.coordinates,
            },
            properties: {
                id: todo.id,
                name: todo.name,
                icon: todo.geometryType === 'Point' ? todo.isCompleted ? completedIcon : unCompletedIcon : undefined,
                tooltipContent: {
                    name: todo.name,
                    priority: todo.priority,
                    date: todo.date.toString().slice(0, 10),
                    subject: todo.subject,
                }
            },
        }))
    };

    return (
        <GeoJsonLayer
            name="Todos Layer"
            data={todosGeoJson}
            zIndex={2}
            tooltipField="tooltipContent" />
    )
}

export default TodosLayer