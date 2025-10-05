import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Typography,
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import { serviceAPI, churchdayAPI } from '../services/api';
import { ServiceFormData, Churchday } from '../types/service';

interface AddServiceModalProps {
    open: boolean;
    onClose: () => void;
    onServiceAdded: () => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ open, onClose, onServiceAdded }) => {
    const [formData, setFormData] = useState<ServiceFormData>({
        start_time: '',
        end_time: '',
        location: '',
        attendance: '',
        speaker: '',
        theme: '',
        churchday: '',
    });
    const [churchdays, setChurchdays] = useState<Churchday[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loadingChurchdays, setLoadingChurchdays] = useState(false);

    // Load churchdays when modal opens
    useEffect(() => {
        if (open) {
            loadChurchdays();
        }
    }, [open]);

    const loadChurchdays = async () => {
        try {
            setLoadingChurchdays(true);
            const response = await churchdayAPI.getAllChurchdays();
            setChurchdays(response.churchdays || []);
        } catch (err: any) {
            console.error('Failed to load churchdays:', err);
            setError('Failed to load church days. Please create a church day first.');
        } finally {
            setLoadingChurchdays(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Prepare data for API call
            const dataToSend = {
                ...formData,
                attendance: formData.attendance === '' ? 0 : Number(formData.attendance),
                start_time: formData.start_time === '' ? undefined : new Date(formData.start_time).toISOString(),
                end_time: formData.end_time === '' ? undefined : new Date(formData.end_time).toISOString(),
            };

            const response = await serviceAPI.createService(dataToSend);
            setSuccess(response.msg || 'Service created successfully!');
            onServiceAdded(); // Trigger refresh in parent component
            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            start_time: '',
            end_time: '',
            location: '',
            attendance: '',
            speaker: '',
            theme: '',
            churchday: '',
        });
        setError(null);
        setSuccess(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <EventIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Add New Service</Typography>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Service Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Service Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Main Sanctuary, Fellowship Hall"
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 150px', minWidth: '100px' }}>
                                    <TextField
                                        fullWidth
                                        label="Expected Attendance"
                                        name="attendance"
                                        type="number"
                                        value={formData.attendance}
                                        onChange={handleInputChange}
                                        inputProps={{ min: 0 }}
                                        helperText="Optional: Initial expected count"
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Speaker"
                                        name="speaker"
                                        value={formData.speaker}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Pastor John Smith"
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Theme"
                                        name="theme"
                                        value={formData.theme}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Faith and Hope"
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Time Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Time Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Start Time"
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="End Time"
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Church Day Selection */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Church Day Selection
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Church Day</InputLabel>
                                        <Select
                                            name="churchday"
                                            value={formData.churchday}
                                            onChange={handleSelectChange}
                                            label="Church Day"
                                            disabled={loadingChurchdays}
                                        >
                                            {churchdays.map((churchday) => (
                                                <MenuItem key={churchday._id} value={churchday._id}>
                                                    {churchday.service_type || 'Church Day'} - {churchday.speaker || 'No Speaker'}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {churchdays.length === 0 && !loadingChurchdays && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            No church days available. Please create a church day first.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || churchdays.length === 0}
                    startIcon={loading ? <CircularProgress size={20} /> : <EventIcon />}
                >
                    {loading ? 'Creating...' : 'Create Service'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddServiceModal;
