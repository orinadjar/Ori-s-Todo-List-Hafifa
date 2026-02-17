import { useRef, useEffect } from "react"

const useThrottling = (callback: () => void, timeout : number) => {

    const isThrottling = useRef(false);

    useEffect(() => {

        if(isThrottling.current)
            return;

        callback();
        
        isThrottling.current = true;

        setTimeout(() => {
            isThrottling.current = false;
        }, timeout)

    }, [callback, timeout]);
}

export default useThrottling;