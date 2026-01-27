import { useEffect, useRef, useState } from 'react'
import { Paper, Typography } from '@mui/material'

import { useAtomValue } from 'jotai';
import { mapInstanceAtom } from '../atoms/mapAtoms';

import { toLonLat } from 'ol/proj';

const CoordsPanel = () => {

    const map = useAtomValue(mapInstanceAtom);
    const [coords, setCoords] = useState([0,0]);
    const throtttleTiomeout = useRef<number | null>(null)

    useEffect(() => {
        if (!map) return;

        const handlePointerMove = (event: any) => {
            if (throtttleTiomeout.current) return;

            const lonLat = toLonLat(event.coordinate);
            setCoords(lonLat);

            throtttleTiomeout.current = setTimeout(() => {
                throtttleTiomeout.current = null;
            }, 100)
        };

        map.on('pointermove', handlePointerMove);

        return () => {
            map.un('pointermove', handlePointerMove);
            if (throtttleTiomeout.current) {
                clearTimeout(throtttleTiomeout.current);
            }
        }
    }, [map])

    return (
        <Paper sx={{ position: "fixed", bottom: 20, right: 25, zIndex: 1000, alignItems: 'center', minWidth: 150 }} style={{ boxShadow: '-2px 8px 9px rgba(2, 2, 2, 0.2)' }}>
            <Typography style={{ opacity: 0.5 }}>Cursor Coords</Typography>
            <Typography style={{ fontWeight: 'bold'}}>{coords[0].toFixed(4)}, {coords[1].toFixed(4)}</Typography>
        </Paper>
    );
};

export default CoordsPanel
