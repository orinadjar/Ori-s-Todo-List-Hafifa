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

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useForm, type SubmitHandler, Controller } from "react-hook-form";

import type { TodoSubject } from "../types/types";
import TodoMapComponent from "./TodoMapComponent";

import type { Todo } from "../types/types";

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

const TodoDialog = ({ handleCloseDialog, isDialogOpen, editingTodoId }: Props) => {
  const { todos, addTodo, updateTodo } = useTodos();

  type FormFields = {
    name: string,
    subject: TodoSubject,
    priority: number,
    date: Dayjs | null,
    geometryType: "Point" | "Polygon",
    pointCoordinates: [number, number] | null,
    polygonCoordinates: number[][][] | null,
  }

  const { register, setValue, handleSubmit, watch, reset, control } = useForm<FormFields>({
    defaultValues: {
      name: "",
      subject: "General",
      priority: 1,
      date: dayjs(),
      geometryType: "Point",
      pointCoordinates: null,
      polygonCoordinates: null,
    }
  });

  const geometryType = watch("geometryType");
  const pointCoordinates = watch("pointCoordinates");
  const polygonCoordinates = watch("polygonCoordinates");
  const name = watch("name");
  const subject = watch("subject");
  const priority = watch("priority");
  const date = watch("date");

  const todoToEdit = editingTodoId
    ? todos.find((t) => t.id === editingTodoId)
    : null;

  const handleCancel = () => {
    reset();
    handleCloseDialog();
  };

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    if (data.name.trim() && data.date && (data.pointCoordinates || data.polygonCoordinates)) {
      const finalDate = data.date.toDate();

      const todoData = {
        name: data.name,
        subject: data.subject,
        priority: data.priority,
        date: finalDate,
        geometryType: data.geometryType,
        lat:
          data.geometryType === "Point" && data.pointCoordinates
            ? data.pointCoordinates[0]
            : 0,
        lng:
          data.geometryType === "Point" && data.pointCoordinates
            ? data.pointCoordinates[1]
            : 0,
        coordinates: data.geometryType === "Polygon" ? data.polygonCoordinates : null,
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
      setValue("date", dayjs(todoToEdit.date));
      setValue("geometryType", todoToEdit.geometryType);

      if (
        todoToEdit.geometryType === "Polygon" &&
        todoToEdit.lat === 0 &&
        todoToEdit.lng === 0 &&
        todoToEdit.coordinates
      ) {
        setValue("polygonCoordinates", todoToEdit.coordinates);
        setValue("pointCoordinates", null);
      } else if (
        todoToEdit.geometryType === "Point" &&
        todoToEdit.lat !== undefined &&
        todoToEdit.lng !== undefined
      ) {
        setValue("pointCoordinates", [todoToEdit.lat, todoToEdit.lng]);
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
            {...register('name')}
            value={name}
            autoFocus
          ></TextField>

          <TextField
            select
            label="Subject"
            {...register('subject')}
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
            {...register('priority')}
            value={priority}
            fullWidth
          >
            {[...Array(10)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
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
          {...register('geometryType')}
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
              [
                {
                  ...todoToEdit,
                  geometryType: geometryType,
                  lat:
                    geometryType === "Point" && pointCoordinates
                      ? pointCoordinates[0]
                      : 0,
                  lng:
                    geometryType === "Point" && pointCoordinates
                      ? pointCoordinates[1]
                      : 0,
                  coordinates:
                    geometryType === "Polygon" &&
                      todoToEdit?.lat === 0 &&
                      todoToEdit.lng === 0
                      ? todoToEdit?.coordinates
                      : undefined,
                },
              ] as Todo[]
            }
            onLocationSelect={(coordinates) => setValue('pointCoordinates', coordinates)}
            onPolygonSelect={(coordinates) => setValue('polygonCoordinates', coordinates)}
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
