import { useEffect, useState } from "react";

import { useMap } from "../MapContext";

import { Layer } from "ol/layer";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";

const MapHUD = () => {
  const { map } = useMap();
  const [layers, setLayers] = useState<Layer[]>([]);
  const [, setRender] = useState(0);

  useEffect(() => {
    if (!map) return;

    const updateLayers = () => {
      const allLayers = map.getAllLayers();
      setLayers([...allLayers]);
    };

    updateLayers();
    map.getLayers().on("change:length", updateLayers);
  }, [map]);

  const handleToggle = (layer: Layer) => {
    const newVisibility = !layer.getVisible();
    layer.setVisible(newVisibility);
    setRender(prev => prev + 1);
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        minWidth: 150,
        borderRadius: 2,
        zIndex: 1000,
      }}
    >
      <FormGroup>
        {layers.map((layer, index) => {
          const name = layer.get("name");
          if (!name) return null;

          return (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  size="small"
                  checked={layer.getVisible()}
                  onChange={() => handleToggle(layer)}
                />
              }
              label={<Typography>{name}</Typography>}
            />
          );
        })}
      </FormGroup>
    </Paper>
  );
};

export default MapHUD;
