import { useTodos } from "../../../context/todoContext"
import GeoJsonLayer from "./GeoJsonLayer"

import completedIcon from '../../../assets/green-selector-icon.png';
import unCompletedIcon from '../../../assets/selector-icon.png';

const TodosLayer = () => {

    const { filteredTodos } = useTodos();

    const todosGeoJson = {
        type: 'FeatureCollection',
        features: filteredTodos.filter( todo => todo.location ).map(todo => ({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: todo.location
            },
            properties: {
                id: todo.id,
                name: todo.name,
                icon: todo.isCompleted ? completedIcon : unCompletedIcon,
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