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
import AddChurchdayModal from '../components/AddChurchdayModal';
import { churchdayAPI } from '../services/api';
import { User } from '../types/auth';
import { Churchday } from '../types/service';

const Churchdays: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [churchdays, setChurchdays] = useState<Churchday[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addChurchdayModalOpen, setAddChurchdayModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedChurchday, setSelectedChurchday] = useState<Churchday | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [churchdayToDelete, setChurchdayToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser: User = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role !== 'admin') {
                navigate('/dashboard'); // Redirect if not admin
            } else {
                loadChurchdays();
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadChurchdays = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await churchdayAPI.getAllChurchdays();
            setChurchdays(response.churchdays || []);
        } catch (err: any) {
            console.error('Failed to load church days:', err);
            setError(err.message || 'Failed to load church days.');
        } finally {
            setLoading(false);
        }
    };

    const handleChurchdayAdded = () => {
        loadChurchdays();
    };

    const handleViewChurchday = (churchday: Churchday) => {
        setSelectedChurchday(churchday);
        setViewModalOpen(true);
    };

    const handleDeleteChurchday = (id: string) => {
        setChurchdayToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (churchdayToDelete) {
            try {
                setLoading(true);
                setError(null);
                await churchdayAPI.deleteChurchday(churchdayToDelete);
                setError('Church day deleted successfully!');
                loadChurchdays();
            } catch (err: any) {
                console.error('Failed to delete church day:', err);
                setError(err.message || 'Failed to delete church day.');
            } finally {
                setLoading(false);
                setDeleteConfirmOpen(false);
                setChurchdayToDelete(null);
            }
        }
    };

    const getServiceTypeColor = (serviceType?: string) => {
        switch (serviceType) {
            case 'sunday': return 'primary';
            case 'christmas': return 'success';
            case 'easter': return 'warning';
            case 'monday':
            case 'tuesday':
            case 'wednesday': return 'secondary';
            default: return 'default';
        }
    };

    const getServiceTypeLabel = (serviceType?: string) => {
        switch (serviceType) {
            case 'sunday': return 'Sunday Service';
            case 'christmas': return 'Christmas Service';
            case 'easter': return 'Easter Service';
            case 'monday': return 'Monday Service';
            case 'tuesday': return 'Tuesday Service';
            case 'wednesday': return 'Wednesday Service';
            default: return 'General Service';
        }
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
                        Church Day Management
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadChurchdays}
                            disabled={loading}
                            sx={{ mr: 2 }}
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddChurchdayModalOpen(true)}
                        >
                            Create Church Day
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
                                        <TableCell>Service Type</TableCell>
                                        <TableCell>Speaker</TableCell>
                                        <TableCell>Current Attendance</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Service ID</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {churchdays.length === 0 && !loading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                No church days found. Click "Create Church Day" to get started!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        churchdays.map((churchday) => (
                                            <TableRow key={churchday._id}>
                                                <TableCell>
                                                    <Chip
                                                        label={getServiceTypeLabel(churchday.service_type)}
                                                        color={getServiceTypeColor(churchday.service_type)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{churchday.speaker || 'N/A'}</TableCell>
                                                <TableCell>
                                                    {churchday.attendance ? (
                                                        <Chip
                                                            label={`${churchday.attendance} attended`}
                                                            color={churchday.attendance > 0 ? 'success' : 'default'}
                                                            size="small"
                                                        />
                                                    ) : (
                                                        'No attendance yet'
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {churchday.comment ? (
                                                        churchday.comment.length > 50
                                                            ? `${churchday.comment.substring(0, 50)}...`
                                                            : churchday.comment
                                                    ) : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {churchday.service ? (
                                                        <Typography variant="caption" color="text.secondary">
                                                            {churchday.service}
                                                        </Typography>
                                                    ) : 'Not linked'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton onClick={() => handleViewChurchday(churchday)} color="info">
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleDeleteChurchday(churchday._id)} color="error">
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

                {/* View Church Day Details Modal */}
                <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Typography variant="h6">
                            Church Day Details - {selectedChurchday && getServiceTypeLabel(selectedChurchday.service_type)}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedChurchday && (
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Service Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Service Type:</strong> {getServiceTypeLabel(selectedChurchday.service_type)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Speaker:</strong> {selectedChurchday.speaker || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Expected Attendance:</strong> {selectedChurchday.attendance || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Service ID:</strong> {selectedChurchday.service || 'Not linked to any service'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Additional Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Comments:</strong>
                                            </Typography>
                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                {selectedChurchday.comment || 'No comments provided'}
                                            </Typography>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Church Day ID
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedChurchday._id}
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
                            Are you sure you want to delete this church day? This action cannot be undone.
                            Note: Any services linked to this church day will be affected.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" autoFocus disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Church Day Modal */}
                <AddChurchdayModal
                    open={addChurchdayModalOpen}
                    onClose={() => setAddChurchdayModalOpen(false)}
                    onChurchdayAdded={handleChurchdayAdded}
                />
            </Container>
        </Layout>
    );
};

export default Churchdays;
