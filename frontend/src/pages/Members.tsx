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
    Avatar,
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
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
} from '@mui/icons-material';
import { User } from '../types/auth';
import { memberAPI } from '../services/api';
import Layout from '../components/Layout';
import AddMemberModal from '../components/AddMemberModal';

const Members: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in and is admin
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role === 'admin') {
                loadMembers();
            } else {
                setError('Access denied. Admin privileges required.');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            setError(null);
            const membersData = await memberAPI.getAllMembers();
            setMembers(membersData.members || []);
        } catch (err: any) {
            console.error('Failed to load members:', err);
            setError('Failed to load members. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMemberAdded = () => {
        loadMembers();
    };

    const handleViewMember = (member: any) => {
        setSelectedMember(member);
        setViewModalOpen(true);
    };

    const handleDeleteMember = async (memberId: string) => {
        if (window.confirm('Are you sure you want to delete this member?')) {
            try {
                await memberAPI.deleteMember(memberId);
                loadMembers();
            } catch (err: any) {
                setError(err.message || 'Failed to delete member.');
            }
        }
    };

    if (!user) {
        return (
            <Container>
                <Alert severity="info">Loading...</Alert>
            </Container>
        );
    }

    if (user.role !== 'admin') {
        return (
            <Layout user={user}>
                <Container>
                    <Alert severity="error">
                        Access denied. Admin privileges required to view this page.
                    </Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout user={user}>
            <Container maxWidth="xl">
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom color="primary">
                            Member Management
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your church members and their information
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setAddMemberModalOpen(true)}
                        size="large"
                    >
                        Add New Member
                    </Button>
                </Box>

                {/* Error Alert */}
                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {/* Members Table */}
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6">
                                Church Members ({members.length})
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={loadMembers}
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : undefined}
                            >
                                {loading ? 'Loading...' : 'Refresh'}
                            </Button>
                        </Box>

                        {members.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Member</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Phone</TableCell>
                                            <TableCell>Ministry</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="center">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {members.map((member) => (
                                            <TableRow key={member._id} hover>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                            {member.surname?.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2">
                                                                {member.surname} {member.other_names}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {member.occupation || 'No occupation listed'}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{member.email}</TableCell>
                                                <TableCell>{member.phone || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={member.ministry_membership || 'None'}
                                                        color={member.ministry_membership ? 'primary' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={member.saved_or_not ? 'Saved' : 'Not Saved'}
                                                        color={member.saved_or_not ? 'success' : 'default'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        color="primary"
                                                        onClick={() => handleViewMember(member)}
                                                        size="small"
                                                    >
                                                        <ViewIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() => {/* TODO: Implement edit */ }}
                                                        size="small"
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color="error"
                                                        onClick={() => handleDeleteMember(member._id)}
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Box textAlign="center" py={8}>
                                <PersonAddIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    No Members Found
                                </Typography>
                                <Typography variant="body2" color="text.secondary" mb={3}>
                                    Start building your church community by adding your first member.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<PersonAddIcon />}
                                    onClick={() => setAddMemberModalOpen(true)}
                                >
                                    Add First Member
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Add Member Modal */}
                <AddMemberModal
                    open={addMemberModalOpen}
                    onClose={() => setAddMemberModalOpen(false)}
                    onMemberAdded={handleMemberAdded}
                />

                {/* View Member Modal */}
                <Dialog
                    open={viewModalOpen}
                    onClose={() => setViewModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <Typography variant="h6">
                            Member Details - {selectedMember?.surname} {selectedMember?.other_names}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedMember && (
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Personal Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Name:</strong> {selectedMember.surname} {selectedMember.other_names}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Email:</strong> {selectedMember.email}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Phone:</strong> {selectedMember.phone || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Age:</strong> {selectedMember.age || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Gender:</strong> {selectedMember.gender || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Marital Status:</strong> {selectedMember.marital_status || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Church Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Occupation:</strong> {selectedMember.occupation || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Ministry:</strong> {selectedMember.ministry_membership || 'None'}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Saved Status:</strong>
                                                <Chip
                                                    label={selectedMember.saved_or_not ? 'Saved' : 'Not Saved'}
                                                    color={selectedMember.saved_or_not ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Baptism Status:</strong>
                                                <Chip
                                                    label={selectedMember.baptism_status ? 'Baptized' : 'Not Baptized'}
                                                    color={selectedMember.baptism_status ? 'success' : 'default'}
                                                    size="small"
                                                    sx={{ ml: 1 }}
                                                />
                                            </Typography>
                                        </Box>
                                    </Box>
                                    {selectedMember.address && (
                                        <Box>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Address
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedMember.address}
                                            </Typography>
                                        </Box>
                                    )}
                                    {selectedMember.emergency_contact && (
                                        <Box>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Emergency Contact
                                            </Typography>
                                            <Typography variant="body2">
                                                {selectedMember.emergency_contact}
                                            </Typography>
                                        </Box>
                                    )}
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
            </Container>
        </Layout>
    );
};

export default Members;
