import { Box, Button, Modal, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography, Paper } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { TaskErrors } from '../../interfaces/task-error.interface';
import { Task } from '../../interfaces/task.interface';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const TaskList = () => {
    const { token } = useContext(AppContext) as any;
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(5);
    const [totalTasks, setTotalTasks] = useState<number>(0);
    const [search, setSearch] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>(search);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [errors, setErrors] = useState<TaskErrors>({});
    const [formData, setFormData] = useState<Task>({
        title: '',
        description: '',
    });

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: debouncedSearch,
                page: page.toString(),
                per_page: perPage.toString(),
            }).toString();

            const res = await fetch(`/api/tasks?${queryParams}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setTasks(data.data);
            setTotalTasks(data.total);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        try {
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.errors) {
                setErrors(data.errors);
                setOpenModal(true);
            } else {
                setOpenModal(false);
                resetForm();
                setErrors({});
                fetchTasks();
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleEditTask = async () => {
        if (currentTask) {
            try {
                const res = await fetch(`/api/tasks/${currentTask.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });
                const data = await res.json();
                if (data.errors) {
                    setErrors(data.errors);
                    setOpenModal(true);
                } else {
                    setOpenModal(false);
                    resetForm();
                    setErrors({});
                    fetchTasks();
                }
            } catch (error) {
                console.error('Error editing task:', error);
            }
        }
    };

    const handleDelete = async (taskId: number | null = null) => {
        if (taskId) {
            try {
                const res = await fetch(`/api/tasks/${taskId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (res.ok) {
                    fetchTasks();
                }
            } catch (error) {
                console.error('Error editing task:', error);
            }
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
    };

    const handlePageChange = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage);
    };

    const handlePerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPerPage(parseInt(event.target.value, 10));
    };

    const openTaskModal = (task: Task | null = null) => {
        if (task) {
            setCurrentTask(task);
            setFormData({ title: task.title, description: task.description });
        } else {
            setCurrentTask(null);
            resetForm();
        }
        setOpenModal(true);
    };

    const handleCancel = () => {
        setOpenModal(false);
        resetForm();
        setErrors({});
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => {
            clearTimeout(timer);
        };
    }, [search]);

    useEffect(() => {
        fetchTasks();
    }, [page, perPage, debouncedSearch]);

    return (
        <Box sx={{ padding: 3 }}>
            <TextField
                label="Search Tasks"
                variant="outlined"
                fullWidth
                value={search}
                onChange={handleSearchChange}
                sx={{ marginBottom: 2 }}
            />
            <Button variant="contained" onClick={() => openTaskModal()} sx={{ marginBottom: 2 }}>
                Add Task
            </Button>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : tasks.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No records found
                                </TableCell>
                            </TableRow>
                        ) : (
                            tasks.map((task) => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.id}</TableCell>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>
                                        <Stack gap={1} flexDirection="row">
                                            <Button size="small" variant="outlined" onClick={() => openTaskModal(task)}>
                                                Edit
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleDelete(task.id)}
                                            >
                                                Delete
                                            </Button>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalTasks}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={perPage}
                onRowsPerPageChange={handlePerPageChange}
                rowsPerPageOptions={[5, 10, 25]}
            />

            <Modal
                open={openModal}
                onClose={handleCancel}
                aria-labelledby="task-modal"
                aria-describedby="task-modal-description"
            >
                <Box sx={style}>
                    <Typography id="task-modal" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                        {currentTask ? 'Edit Task' : 'Add Task'}
                    </Typography>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    {errors.title && (
                        <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'red' }}>
                        {errors.title[0]}
                        </Typography>
                    )}
                    <TextField
                        label="Description"
                        variant="outlined"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    {errors.description && (
                        <Typography sx={{ fontSize: '11px', fontStyle: 'italic', color: 'red' }}>
                        {errors.description[0]}
                        </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                        <Button onClick={handleCancel} color="secondary" variant="outlined">
                        Cancel
                        </Button>
                        <Button
                        onClick={currentTask ? handleEditTask : handleAddTask}
                        variant="contained"
                        color="primary"
                        >
                        {currentTask ? 'Update' : 'Add'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default TaskList;
