import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Alert,
    Box,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Refresh as RefreshIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import Layout from '../components/Layout';
import AddServiceModal from '../components/AddServiceModal';
import { serviceAPI } from '../services/api';
import { User } from '../types/auth';
import { Service } from '../types/service';

const Services: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser: User = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role !== 'admin') {
                navigate('/dashboard'); // Redirect if not admin
            } else {
                loadServices();
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadServices = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await serviceAPI.getAllServices();
            setServices(response.services || []);
        } catch (err: any) {
            console.error('Failed to load services:', err);
            setError(err.message || 'Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const handleServiceAdded = () => {
        loadServices();
    };

    const handleViewService = (service: Service) => {
        setSelectedService(service);
        setViewModalOpen(true);
    };

    const handleDeleteService = (id: string) => {
        setServiceToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (serviceToDelete) {
            try {
                setLoading(true);
                setError(null);
                await serviceAPI.deleteService(serviceToDelete);
                setError('Service deleted successfully!');
                loadServices();
            } catch (err: any) {
                console.error('Failed to delete service:', err);
                setError(err.message || 'Failed to delete service.');
            } finally {
                setLoading(false);
                setDeleteConfirmOpen(false);
                setServiceToDelete(null);
            }
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    if (!user || user.role !== 'admin') {
        return (
            <Layout user={user}>
                <Container>
                    <Alert severity="warning">You do not have permission to view this page.</Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout user={user}>
            <Container maxWidth="xl">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1" color="primary">
                        Service Management
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadServices}
                            disabled={loading}
                            sx={{ mr: 2 }}
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddServiceModalOpen(true)}
                        >
                            Add New Service
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <Card>
                    <CardContent>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Location</TableCell>
                                        <TableCell>Speaker</TableCell>
                                        <TableCell>Theme</TableCell>
                                        <TableCell>Start Time</TableCell>
                                        <TableCell>End Time</TableCell>
                                        <TableCell>Current Attendance</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {services.length === 0 && !loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No services found. Click "Add New Service" to get started!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        services.map((service) => (
                                            <TableRow key={service._id}>
                                                <TableCell>{service.location}</TableCell>
                                                <TableCell>{service.speaker || 'N/A'}</TableCell>
                                                <TableCell>{service.theme || 'N/A'}</TableCell>
                                                <TableCell>{formatDateTime(service.start_time)}</TableCell>
                                                <TableCell>{formatDateTime(service.end_time)}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={`${service.attendance} attended`}
                                                        color={service.attendance > 0 ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => handleViewService(service)} color="info">
                                                        <ViewIcon />
                                                    </IconButton>
                                                    {/* <IconButton onClick={() => handleEditService(service)} color="primary">
                            <EditIcon />
                          </IconButton> */}
                                                    <IconButton onClick={() => handleDeleteService(service._id)} color="error">
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {loading && (
                            <Box display="flex" justifyContent="center" py={3}>
                                <CircularProgress />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* View Service Details Modal */}
                <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Typography variant="h6">
                            Service Details - {selectedService?.location}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedService && (
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Service Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Location:</strong> {selectedService.location}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Speaker:</strong> {selectedService.speaker || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Theme:</strong> {selectedService.theme || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Expected Attendance:</strong> {selectedService.attendance}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Time Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Start Time:</strong> {formatDateTime(selectedService.start_time)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>End Time:</strong> {formatDateTime(selectedService.end_time)}
                                            </Typography>
                                            <Typography variant="subtitle2" color="primary" gutterBottom sx={{ mt: 2 }}>
                                                Church Day ID
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedService.churchday}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setViewModalOpen(false)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Delete Confirmation Modal */}
                <Dialog
                    open={deleteConfirmOpen}
                    onClose={() => setDeleteConfirmOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                        <Typography id="alert-dialog-description">
                            Are you sure you want to delete this service? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" autoFocus disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Service Modal */}
                <AddServiceModal
                    open={addServiceModalOpen}
                    onClose={() => setAddServiceModalOpen(false)}
                    onServiceAdded={handleServiceAdded}
                />
            </Container>
        </Layout>
    );
};

export default Services;
