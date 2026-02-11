import GeoJsonLayer from "./GeoJsonLayer";
import completedIcon from "../../../assets/green-selector-icon.png";
import unCompletedIcon from "../../../assets/selector-icon.png";
import { useMemo } from "react";

import { useAtom } from "jotai";
import { filteredTodosAtom } from "../../../atoms/todoAtoms";

const TodosLayer = () => {
  const [filteredTodos] = useAtom(filteredTodosAtom);

  const todosGeoJson = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: filteredTodos
        .filter((todo) => todo.location)
        .map((todo) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: todo.location,
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
            },
          },
        })),
    };
  }, [filteredTodos]);

  return (
    <GeoJsonLayer
      name="Todos Layer"
      data={todosGeoJson}
      zIndex={2}
      tooltipField="tooltipContent"
    />
  );
};

export default TodosLayer;
