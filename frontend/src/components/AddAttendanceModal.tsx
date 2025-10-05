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
import { Assessment as AssessmentIcon } from '@mui/icons-material';
import { attendanceAPI, memberAPI } from '../services/api';
import { AttendanceFormData } from '../types/service';

// Define Member interface for the dropdown
interface Member {
    _id: string;
    surname: string;
    other_names: string;
    email: string;
}

interface AddAttendanceModalProps {
    open: boolean;
    onClose: () => void;
    onAttendanceAdded: () => void;
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({ open, onClose, onAttendanceAdded }) => {
    const [formData, setFormData] = useState<AttendanceFormData>({
        check_in: '',
        check_out: '',
        member_id: '',
    });
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loadingMembers, setLoadingMembers] = useState(false);

    // Load members when modal opens
    useEffect(() => {
        if (open) {
            loadMembers();
        }
    }, [open]);

    const loadMembers = async () => {
        try {
            setLoadingMembers(true);
            const response = await memberAPI.getAllMembers();
            setMembers(response.members || []);
        } catch (err: any) {
            console.error('Failed to load members:', err);
            setError('Failed to load members. Please ensure members exist first.');
        } finally {
            setLoadingMembers(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                check_in: formData.check_in === '' ? undefined : new Date(formData.check_in).toISOString(),
                check_out: formData.check_out === '' ? undefined : new Date(formData.check_out).toISOString(),
            };

            const response = await attendanceAPI.createAttendance(dataToSend);
            setSuccess(response.msg || 'Attendance record created successfully!');
            onAttendanceAdded(); // Trigger refresh in parent component
            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            check_in: '',
            check_out: '',
            member_id: '',
        });
        setError(null);
        setSuccess(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <AssessmentIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Record Attendance</Typography>
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
                        {/* Member Selection */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Member Selection
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Select Member</InputLabel>
                                        <Select
                                            name="member_id"
                                            value={formData.member_id}
                                            onChange={handleSelectChange}
                                            label="Select Member"
                                            disabled={loadingMembers}
                                        >
                                            {members.map((member) => (
                                                <MenuItem key={member._id} value={member._id}>
                                                    {member.surname} {member.other_names} - {member.email}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {members.length === 0 && !loadingMembers && (
                                        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                                            No members available. Please add members first.
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        {/* Time Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Check-in/Check-out Times
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Check-in Time"
                                        type="datetime-local"
                                        name="check_in"
                                        value={formData.check_in}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="When the member arrived"
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '200px' }}>
                                    <TextField
                                        fullWidth
                                        label="Check-out Time"
                                        type="datetime-local"
                                        name="check_out"
                                        value={formData.check_out}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="When the member left (optional)"
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Quick Actions */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Quick Actions
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const now = new Date();
                                        const nowString = now.toISOString().slice(0, 16); // Format for datetime-local input
                                        setFormData(prev => ({
                                            ...prev,
                                            check_in: nowString,
                                        }));
                                    }}
                                >
                                    Set Check-in to Now
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const now = new Date();
                                        const nowString = now.toISOString().slice(0, 16); // Format for datetime-local input
                                        setFormData(prev => ({
                                            ...prev,
                                            check_out: nowString,
                                        }));
                                    }}
                                >
                                    Set Check-out to Now
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        const now = new Date();
                                        const nowString = now.toISOString().slice(0, 16);
                                        setFormData(prev => ({
                                            ...prev,
                                            check_in: nowString,
                                            check_out: nowString,
                                        }));
                                    }}
                                >
                                    Set Both to Now
                                </Button>
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
                    disabled={loading || members.length === 0 || !formData.member_id}
                    startIcon={loading ? <CircularProgress size={20} /> : <AssessmentIcon />}
                >
                    {loading ? 'Recording...' : 'Record Attendance'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAttendanceModal;
