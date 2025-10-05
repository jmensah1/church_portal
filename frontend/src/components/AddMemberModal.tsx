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
    FormControlLabel,
    Checkbox,
} from '@mui/material';
import { PersonAdd as PersonAddIcon } from '@mui/icons-material';
import { memberAPI } from '../services/api';

interface AddMemberModalProps {
    open: boolean;
    onClose: () => void;
    onMemberAdded: () => void;
}

interface MemberFormData {
    surname: string;
    other_names: string;
    age: number;
    gender: string;
    occupation: string;
    phone: string;
    email: string;
    address: string;
    marital_status: string;
    number_of_children: number;
    spouse_name: string;
    saved_or_not: boolean;
    baptism_status: boolean;
    baptism_date: string;
    ministry_membership: string;
    emergency_contact: string;
    faith_declaration_status: boolean;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ open, onClose, onMemberAdded }) => {
    const [formData, setFormData] = useState<MemberFormData>({
        surname: '',
        other_names: '',
        age: 0,
        gender: '',
        occupation: '',
        phone: '',
        email: '',
        address: '',
        marital_status: '',
        number_of_children: 0,
        spouse_name: '',
        saved_or_not: false,
        baptism_status: false,
        baptism_date: '',
        ministry_membership: '',
        emergency_contact: '',
        faith_declaration_status: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value) || 0,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await memberAPI.createMember(formData);
            setSuccess('Member added successfully!');

            // Reset form
            setFormData({
                surname: '',
                other_names: '',
                age: 0,
                gender: '',
                occupation: '',
                phone: '',
                email: '',
                address: '',
                marital_status: '',
                number_of_children: 0,
                spouse_name: '',
                saved_or_not: false,
                baptism_status: false,
                baptism_date: '',
                ministry_membership: '',
                emergency_contact: '',
                faith_declaration_status: false,
            });

            // Notify parent component
            onMemberAdded();

            // Close modal after a short delay
            setTimeout(() => {
                onClose();
                setSuccess(null);
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Failed to add member. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setError(null);
            setSuccess(null);
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3 }
            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <PersonAddIcon color="primary" />
                    <Typography variant="h6" component="div">
                        Add New Member
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Personal Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Personal Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Surname *"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Other Names *"
                                        name="other_names"
                                        value={formData.other_names}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                                    <TextField
                                        fullWidth
                                        label="Age"
                                        type="number"
                                        name="age"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Gender *</InputLabel>
                                        <Select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleSelectChange}
                                            label="Gender *"
                                        >
                                            <MenuItem value="male">Male</MenuItem>
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Occupation"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                    <TextField
                                        fullWidth
                                        label="Email Address *"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                    <TextField
                                        fullWidth
                                        label="Address *"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        multiline
                                        rows={2}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Family Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Family Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Marital Status *</InputLabel>
                                        <Select
                                            name="marital_status"
                                            value={formData.marital_status}
                                            onChange={handleSelectChange}
                                            label="Marital Status *"
                                        >
                                            <MenuItem value="single">Single</MenuItem>
                                            <MenuItem value="married">Married</MenuItem>
                                            <MenuItem value="divorced">Divorced</MenuItem>
                                            <MenuItem value="separated">Separated</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                                    <TextField
                                        fullWidth
                                        label="Number of Children"
                                        type="number"
                                        name="number_of_children"
                                        value={formData.number_of_children}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Spouse Name"
                                        name="spouse_name"
                                        value={formData.spouse_name}
                                        onChange={handleInputChange}
                                    />
                                </Box>
                            </Box>
                        </Box>

                        {/* Spiritual Information */}
                        <Box>
                            <Typography variant="h6" gutterBottom color="primary">
                                Spiritual Information
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="saved_or_not"
                                                    checked={formData.saved_or_not}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label="Is Saved"
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="baptism_status"
                                                    checked={formData.baptism_status}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label="Is Baptized"
                                        />
                                    </Box>
                                    <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="faith_declaration_status"
                                                    checked={formData.faith_declaration_status}
                                                    onChange={handleCheckboxChange}
                                                />
                                            }
                                            label="Faith Declaration Made"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <TextField
                                        fullWidth
                                        label="Baptism Date"
                                        type="date"
                                        name="baptism_date"
                                        value={formData.baptism_date}
                                        onChange={handleInputChange}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Ministry Membership *</InputLabel>
                                        <Select
                                            name="ministry_membership"
                                            value={formData.ministry_membership}
                                            onChange={handleSelectChange}
                                            label="Ministry Membership *"
                                        >
                                            <MenuItem value="Men's">Men's Ministry</MenuItem>
                                            <MenuItem value="Women's">Women's Ministry</MenuItem>
                                            <MenuItem value="Children's">Children's Ministry</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ flex: '1 1 100%', minWidth: '300px' }}>
                                    <TextField
                                        fullWidth
                                        label="Emergency Contact"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        onChange={handleInputChange}
                                        placeholder="Name and phone number"
                                    />
                                </Box>
                            </Box>
                        </Box>

                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button
                    onClick={handleClose}
                    disabled={loading}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                >
                    {loading ? 'Adding Member...' : 'Add Member'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMemberModal;
