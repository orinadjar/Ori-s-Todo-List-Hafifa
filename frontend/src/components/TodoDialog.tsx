import { useEffect } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import {
  useForm,
  type SubmitHandler,
  Controller,
  useWatch,
} from "react-hook-form";

import type { TodoSubject } from "../types/types";
import TodoMapComponent from "./TodoMapComponent";

import { useTodos } from "../hooks/useTodos";

const SUBJECTS: TodoSubject[] = [
  "Work",
  "Personal",
  "Military",
  "Urgent",
  "General",
];

interface Props {
  isDialogOpen: boolean;
  editingTodoId: string | null;
  handleCloseDialog: () => void;
}

const TodoDialog = ({
  handleCloseDialog,
  isDialogOpen,
  editingTodoId,
}: Props) => {
  const { todos, addTodo, updateTodo } = useTodos();

  type FormFields = {
    name: string;
    subject: TodoSubject;
    priority: number;
    date: Date | null;
    geometryType: "Point" | "Polygon";
    pointCoordinates: [number, number] | null;
    polygonCoordinates: number[][][] | null;
  };

  const { register, setValue, handleSubmit, reset, control } =
    useForm<FormFields>({
      defaultValues: {
        name: "",
        subject: "General",
        priority: 1,
        date: new Date(),
        geometryType: "Point",
        pointCoordinates: null,
        polygonCoordinates: null,
      },
    });

  const geometryType = useWatch({ control, name: "geometryType" });
  const pointCoordinates = useWatch({ control, name: "pointCoordinates" });
  const polygonCoordinates = useWatch({ control, name: "polygonCoordinates" });
  const name = useWatch({ control, name: "name" });
  const subject = useWatch({ control, name: "subject" });
  const priority = useWatch({ control, name: "priority" });

  const todoToEdit = editingTodoId
    ? todos.find((t) => t.id === editingTodoId)
    : null;

  const handleCancel = () => {
    reset();
    handleCloseDialog();
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (
      data.name.trim() &&
      data.date &&
      (data.pointCoordinates || data.polygonCoordinates)
    ) {

      const todoData = {
        name: data.name,
        subject: data.subject,
        priority: data.priority,
        date: data.date,
        geom:
          geometryType === "Point" && pointCoordinates
            ? { type: "Point" as const, coordinates: pointCoordinates }
            : {
                type: "Polygon" as const,
                coordinates: polygonCoordinates ?? [],
              },
      };

      if (editingTodoId) {
        updateTodo({ todoId: editingTodoId, fields: todoData });
      } else {
        addTodo(todoData);
      }
      handleCancel();
    } else {
      alert(
        data.geometryType === "Point"
          ? "Please select a location!"
          : "Please draw a polygon!",
      );
    }
  };

  useEffect(() => {
    if (isDialogOpen && todoToEdit) {
      setValue("name", todoToEdit.name);
      setValue("subject", todoToEdit.subject);
      setValue("priority", todoToEdit.priority);
      setValue("date", new Date(todoToEdit.date));
      setValue("geometryType", todoToEdit.geom.type);

      if (todoToEdit.geom.type === "Polygon") {
        setValue(
          "polygonCoordinates",
          todoToEdit.geom.coordinates as number[][][],
        );
        setValue("pointCoordinates", null);
      } else if (todoToEdit.geom.type === "Point") {
        setValue(
          "pointCoordinates",
          todoToEdit.geom.coordinates as [number, number],
        );
        setValue("polygonCoordinates", null);
      }
    }
  }, [isDialogOpen, todoToEdit, setValue]);

  let locationText: string | null = null;

  if (geometryType === "Point" && pointCoordinates) {
    locationText = `${pointCoordinates[0].toFixed(2)}, ${pointCoordinates[1].toFixed(2)}`;
  }

  if (geometryType === "Polygon" && polygonCoordinates) {
    locationText = JSON.stringify(polygonCoordinates);
  }

  return (
    <Dialog
      open={isDialogOpen}
      onClose={handleCancel}
      fullWidth
      maxWidth="xs"
      PaperProps={{ style: { borderRadius: 12 } }}
    >
      <DialogTitle
        sx={{ fontWeight: "bold", textAlign: "center", bgcolor: "#f8f9fa" }}
      >
        Add new Mission
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Write your next mission"
            fullWidth
            variant="outlined"
            {...register("name")}
            value={name}
            autoFocus
          ></TextField>

          <TextField
            select
            label="Subject"
            {...register("subject")}
            value={subject}
            fullWidth
          >
            {SUBJECTS.map((sub) => (
              <MenuItem key={sub} value={sub}>
                {sub}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            {...register("priority")}
            value={priority}
            fullWidth
          >
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DemoContainer components={["DatePicker"]}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Pick your target date"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                  />
                )}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        <TextField
          select
          label="Geometry Type"
          {...register("geometryType")}
          value={geometryType}
          fullWidth
          sx={{ mt: 4 }}
        >
          <MenuItem value="Point">Point</MenuItem>
          <MenuItem value="Polygon">Polygon</MenuItem>
        </TextField>

        {locationText && (
          <Box
            sx={{ fontSize: "15px", color: "gray", mt: 3, fontWeight: "bold" }}
          >
            Location selected: {locationText}
          </Box>
        )}

        <Box sx={{ mt: 1, height: "300px", width: "100%", borderRadius: 2 }}>
          <TodoMapComponent
            mode={geometryType}
            todos={
              todoToEdit
                ? [
                    {
                      ...todoToEdit,
                      geom:
                        geometryType === "Point" && pointCoordinates
                          ? {
                              type: "Point" as const,
                              coordinates: pointCoordinates,
                            }
                          : geometryType === "Polygon" && polygonCoordinates
                            ? {
                                type: "Polygon" as const,
                                coordinates: polygonCoordinates,
                              }
                            : todoToEdit.geom || {
                                type: "Point" as const,
                                coordinates: [0, 0],
                              },
                    },
                  ]
                : []
            }
            onLocationSelect={(cordinates) =>
              setValue("pointCoordinates", cordinates)
            }
            onPolygonSelect={(coordinates) =>
              setValue("polygonCoordinates", coordinates)
            }
          />
        </Box>
      </DialogContent>

      <DialogContent sx={{ p: 2, bgcolor: "#f8f9fa" }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={!name.trim()}
          sx={{ ml: 25, px: 4, borderRadius: 2 }}
        >
          {isDialogOpen && editingTodoId ? "Update" : "Add Task"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
