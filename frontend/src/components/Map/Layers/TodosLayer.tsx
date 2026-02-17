import GeoJsonLayer from "./GeoJsonLayer"

import completedIcon from '../../../assets/green-selector-icon.png';
import unCompletedIcon from '../../../assets/selector-icon.png';

import { useTodos } from "../../../hooks/useTodos";
import { useAtomValue } from "jotai";
import { debouncedSearchAtom } from "../../../atoms/todoAtoms";

const TodosLayer = () => {

    const searchTerm = useAtomValue(debouncedSearchAtom);

    const { todos } = useTodos(searchTerm);

    const todosGeoJson = {
        type: 'FeatureCollection',
        features: todos.map(todo => ({
            type: 'Feature',
            geometry: {
                type: todo.geom.type,
                coordinates: todo.geom.coordinates,
            },
            properties: {
                id: todo.id,
                name: todo.name,
                icon: todo.geom.type === 'Point' ? todo.isCompleted ? completedIcon : unCompletedIcon : undefined,
                tooltipContent: {
                    name: todo.name,
                    priority: todo.priority,
                    isCompleted: todo.isCompleted,
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