import { useRef, useEffect } from "react"
import type { Todo } from "../types/types"

interface Props {
    trigger: unknown,
    cb: () => void,
    timeout: number
}

const useThrottling = ({ trigger, cb, timeout }: Props) => {

    const isThrottling = useRef(false);

    useEffect(() => {

        if(isThrottling.current)
            return;

        cb();

        isThrottling.current = true;

        setTimeout(() => {
            isThrottling.current = false;
        }, timeout)

    }, [trigger, cb, timeout]);
}

export default useThrottling;