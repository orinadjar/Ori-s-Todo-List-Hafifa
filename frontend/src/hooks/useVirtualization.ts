import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useEffect } from 'react';

export const useVirtualization = (dataLength: number, hasNextPage: boolean, isFetchingNextPage: boolean, fetchNextPage: () => void, estimateSize: number) => {

    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: dataLength,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateSize,
    })

    const virtualRows = rowVirtualizer.getVirtualItems();

    useEffect(() => {
        const lastItem = virtualRows[virtualRows.length - 1];

        if(!lastItem) return;

        if( lastItem.index >= dataLength - 1 && hasNextPage && !isFetchingNextPage){
            fetchNextPage();
        }

    }, [virtualRows, dataLength, fetchNextPage, hasNextPage, isFetchingNextPage]);
    
    return ({
        parentRef, 
        rowVirtualizer,
        virtualRows
    });
}