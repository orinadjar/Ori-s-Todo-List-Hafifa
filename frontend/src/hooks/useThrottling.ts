import { useRef, useEffect } from "react"
import type { Todo } from "../types/types"

const useThrottling = (todos: Todo[]) => {

    const isThrottling = useRef(false);

    useEffect(() => {

        if(isThrottling.current)
            return;

        localStorage.setItem('todos', JSON.stringify(todos));

        isThrottling.current = true;

        setTimeout(() => {
            isThrottling.current = false;
        }, 300)

    }, [todos]);
}

export default useThrottling;