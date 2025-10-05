import React, { useState } from 'react';
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
import { churchdayAPI } from '../services/api';
import { ChurchdayFormData } from '../types/service';

interface AddChurchdayModalProps {
    open: boolean;
    onClose: () => void;
    onChurchdayAdded: () => void;
}

const AddChurchdayModal: React.FC<AddChurchdayModalProps> = ({ open, onClose, onChurchdayAdded }) => {
    const [formData, setFormData] = useState<ChurchdayFormData>({
        attendance: '',
        speaker: '',
        comment: '',
        service_type: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

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
                attendance: formData.attendance === '' ? undefined : Number(formData.attendance),
                service_type: formData.service_type === '' ? undefined : formData.service_type,
            };

            await churchdayAPI.createChurchday(dataToSend);
            setSuccess('Church day created successfully!');
            onChurchdayAdded(); // Trigger refresh in parent component
            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            attendance: '',
            speaker: '',
            comment: '',
            service_type: '',
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
                    <Typography variant="h6">Create Church Day</Typography>
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
                        {/* Church Day Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Church Day Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <FormControl fullWidth>
                                        <InputLabel>Service Type</InputLabel>
                                        <Select
                                            name="service_type"
                                            value={formData.service_type}
                                            onChange={handleSelectChange}
                                            label="Service Type"
                                        >
                                            <MenuItem value="sunday">Sunday Service</MenuItem>
                                            <MenuItem value="monday">Monday Service</MenuItem>
                                            <MenuItem value="tuesday">Tuesday Service</MenuItem>
                                            <MenuItem value="wednesday">Wednesday Service</MenuItem>
                                            <MenuItem value="christmas">Christmas Service</MenuItem>
                                            <MenuItem value="easter">Easter Service</MenuItem>
                                        </Select>
                                    </FormControl>
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
                                        placeholder="e.g., 150"
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
                            </Box>
                        </Box>

                        {/* Comments */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Additional Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Comments"
                                        name="comment"
                                        value={formData.comment}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={3}
                                        placeholder="Any additional notes about this church day..."
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Service Type Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Service Type Details
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 100%', minWidth: '250px' }}>
                                    <Alert severity="info" sx={{ mb: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Service Type Options:</strong>
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            • <strong>Sunday Service</strong> - Regular Sunday worship
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            • <strong>Monday/Tuesday/Wednesday</strong> - Mid-week services
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            • <strong>Christmas Service</strong> - Christmas celebration
                                        </Typography>
                                        <Typography variant="body2" component="div">
                                            • <strong>Easter Service</strong> - Easter celebration
                                        </Typography>
                                    </Alert>
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
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <EventIcon />}
                >
                    {loading ? 'Creating...' : 'Create Church Day'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddChurchdayModal;
