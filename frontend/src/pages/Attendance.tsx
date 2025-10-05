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
import AddAttendanceModal from '../components/AddAttendanceModal';
import { attendanceAPI, memberAPI } from '../services/api';
import { User } from '../types/auth';
import { Attendance as AttendanceType } from '../types/service';

// Define Member interface for display
interface Member {
    _id: string;
    surname: string;
    other_names: string;
    email: string;
}

const Attendance: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceType[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [addAttendanceModalOpen, setAddAttendanceModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceType | null>(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser: User = JSON.parse(userData);
            setUser(parsedUser);
            if (parsedUser.role !== 'admin') {
                navigate('/dashboard'); // Redirect if not admin
            } else {
                loadAttendanceRecords();
                loadMembers();
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const loadAttendanceRecords = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await attendanceAPI.getAllAttendance();
            setAttendanceRecords(response.attendanceRecords || []);
        } catch (err: any) {
            console.error('Failed to load attendance records:', err);
            setError(err.message || 'Failed to load attendance records.');
        } finally {
            setLoading(false);
        }
    };

    const loadMembers = async () => {
        try {
            const response = await memberAPI.getAllMembers();
            setMembers(response.members || []);
        } catch (err: any) {
            console.error('Failed to load members:', err);
        }
    };

    const handleAttendanceAdded = () => {
        loadAttendanceRecords();
    };

    const handleViewAttendance = (attendance: AttendanceType) => {
        setSelectedAttendance(attendance);
        setViewModalOpen(true);
    };

    const handleDeleteAttendance = (id: string) => {
        setRecordToDelete(id);
        setDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (recordToDelete) {
            try {
                setLoading(true);
                setError(null);
                await attendanceAPI.deleteAttendance(recordToDelete);
                setError('Attendance record deleted successfully!');
                loadAttendanceRecords();
            } catch (err: any) {
                console.error('Failed to delete attendance record:', err);
                setError(err.message || 'Failed to delete attendance record.');
            } finally {
                setLoading(false);
                setDeleteConfirmOpen(false);
                setRecordToDelete(null);
            }
        }
    };

    const formatDateTime = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    const getMemberName = (memberId: string) => {
        const member = members.find(m => m._id === memberId);
        return member ? `${member.surname} ${member.other_names}` : 'Unknown Member';
    };

    const getMemberEmail = (memberId: string) => {
        const member = members.find(m => m._id === memberId);
        return member ? member.email : 'N/A';
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
                        Attendance Management
                    </Typography>
                    <Box>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={loadAttendanceRecords}
                            disabled={loading}
                            sx={{ mr: 2 }}
                        >
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddAttendanceModalOpen(true)}
                        >
                            Record Attendance
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
                                        <TableCell>Member</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Check-in</TableCell>
                                        <TableCell>Check-out</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {attendanceRecords.length === 0 && !loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No attendance records found. Click "Record Attendance" to get started!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        attendanceRecords.map((record) => {
                                            const checkIn = record.check_in ? new Date(record.check_in) : null;
                                            const checkOut = record.check_out ? new Date(record.check_out) : null;
                                            const duration = checkIn && checkOut ?
                                                Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60)) : null; // minutes

                                            return (
                                                <TableRow key={record._id}>
                                                    <TableCell>{getMemberName(record.member_id)}</TableCell>
                                                    <TableCell>{getMemberEmail(record.member_id)}</TableCell>
                                                    <TableCell>{formatDateTime(record.check_in)}</TableCell>
                                                    <TableCell>{formatDateTime(record.check_out)}</TableCell>
                                                    <TableCell>
                                                        {duration !== null ? `${duration} min` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={record.check_out ? 'Completed' : 'Present'}
                                                            color={record.check_out ? 'success' : 'primary'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton onClick={() => handleViewAttendance(record)} color="info">
                                                            <ViewIcon />
                                                        </IconButton>
                                                        <IconButton onClick={() => handleDeleteAttendance(record._id)} color="error">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
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

                {/* View Attendance Details Modal */}
                <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        <Typography variant="h6">
                            Attendance Details - {selectedAttendance && getMemberName(selectedAttendance.member_id)}
                        </Typography>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedAttendance && (
                            <Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Member Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Name:</strong> {getMemberName(selectedAttendance.member_id)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Email:</strong> {getMemberEmail(selectedAttendance.member_id)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Member ID:</strong> {selectedAttendance.member_id}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Attendance Information
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Check-in:</strong> {formatDateTime(selectedAttendance.check_in)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Check-out:</strong> {formatDateTime(selectedAttendance.check_out)}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                                <strong>Status:</strong> {selectedAttendance.check_out ? 'Completed' : 'Present'}
                                            </Typography>
                                            {selectedAttendance.check_in && selectedAttendance.check_out && (
                                                <Typography variant="body2" gutterBottom>
                                                    <strong>Duration:</strong> {Math.round((new Date(selectedAttendance.check_out).getTime() - new Date(selectedAttendance.check_in).getTime()) / (1000 * 60))} minutes
                                                </Typography>
                                            )}
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
                            Are you sure you want to delete this attendance record? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
                        <Button onClick={confirmDelete} color="error" autoFocus disabled={loading}>
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Add Attendance Modal */}
                <AddAttendanceModal
                    open={addAttendanceModalOpen}
                    onClose={() => setAddAttendanceModalOpen(false)}
                    onAttendanceAdded={handleAttendanceAdded}
                />
            </Container>
        </Layout>
    );
};

export default Attendance;
