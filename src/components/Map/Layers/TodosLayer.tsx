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
                name: todo.name,
                id: todo.id,
                icon: todo.isCompleted ? completedIcon : unCompletedIcon,
            }
        }))
    };

    return (
        <GeoJsonLayer
            name="todos"
            data={todosGeoJson} />
    )
}

export default TodosLayer