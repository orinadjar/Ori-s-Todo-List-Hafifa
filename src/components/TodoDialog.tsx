import { useEffect, useState, useMemo, useCallback } from "react";

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

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useTodos } from "../context/todoContext";
import type { TodoSubject } from "../types/types";
import MapComponent from "./MapComponent";

import type { Todo } from "../types/types";

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
  const { addTodo, filteredTodos, updateTodo } = useTodos();

  const [form, setForm] = useState({
    name: "",
    subject: "General",
    priority: 1,
    date: dayjs("2026-01-01"),
    location: null as [number, number] | null,
  });

  const todoToEdit = useMemo(() => {
    return editingTodoId
      ? filteredTodos.find((t) => t.id === editingTodoId)
      : null;
  }, [editingTodoId, filteredTodos]);

  const handleCancel = () => {
    setForm({
      name: "",
      subject: "General",
      priority: 1,
      date: dayjs("2026-01-01"),
      location: null as [number, number] | null,
    });

    handleCloseDialog();
  };

  const handleSubmit = () => {
    if (form.name.trim() && form.date && form.location) {
      const finalDate = new Date(form.date.format("YYYY-MM-DD"));

      const todoData = {
        name: form.name,
        subject: form.subject as TodoSubject,
        priority: form.priority,
        date: finalDate,
        location: form.location,
      };

      if (editingTodoId) {
        updateTodo(editingTodoId, todoData);
      } else {
        addTodo(todoData);
      }

      handleCancel();
    } else if (!form.location) {
      alert("Most enter a location on the map!");
    }
  };

  useEffect(() => {
    if (isDialogOpen && todoToEdit) {
      setForm({
        name: todoToEdit.name,
        subject: todoToEdit.subject,
        priority: todoToEdit.priority,
        date: dayjs(todoToEdit.date),
        location: todoToEdit.location,
      });
    }
  }, [isDialogOpen, todoToEdit]);

  const handleLocationSelect = useCallback((coordinates: number[]) => {
    setForm((prev) => ({ ...prev, location: coordinates as [number, number] }));
  }, []);

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
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            autoFocus
          ></TextField>

          <TextField
            select
            label="Subject"
            value={form.subject}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, subject: e.target.value }))
            }
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
            value={form.priority}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, priority: Number(e.target.value) }))
            }
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
              <DatePicker
                label="Pick your target date"
                value={form.date}
                onChange={(newValue) =>
                  setForm((prev) => ({ ...prev, date: newValue ?? prev.date }))
                }
              />
            </DemoContainer>
          </LocalizationProvider>
        </Stack>

        {form.location && (
          <Box
            sx={{ fontSize: "15px", color: "gray", mt: 3, fontWeight: "bold" }}
          >
            Location selected: {form.location[0].toFixed(2)},{" "}
            {form.location[1].toFixed(2)}
          </Box>
        )}

        <Box sx={{ mt: 1, height: "300px", width: "100%", borderRadius: 2 }}>
          <MapComponent
            todos={
              (form.location
                ? [{ ...todoToEdit, location: form.location }]
                : []) as Todo[]
            }
            onLocationSelect={handleLocationSelect}
          />
        </Box>
      </DialogContent>

      <DialogContent sx={{ p: 2, bgcolor: "#f8f9fa" }}>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!form.name.trim()}
          sx={{ ml: 25, px: 4, borderRadius: 2 }}
        >
          {isDialogOpen && editingTodoId ? "Update" : "Add Task"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDialog;
