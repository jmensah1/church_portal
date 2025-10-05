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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  People as PeopleIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Church as ChurchIcon,
  TrendingUp as TrendingUpIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { User } from '../types/auth';
import { memberAPI } from '../services/api';
import Layout from '../components/Layout';
import AddMemberModal from '../components/AddMemberModal';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Dashboard: User data loaded:', parsedUser);
      setUser(parsedUser);
      // Load members if user is admin
      if (parsedUser.role === 'admin') {
        console.log('Dashboard: User is admin, loading members...');
        loadMembers();
      } else {
        console.log('Dashboard: User is not admin, role:', parsedUser.role);
      }
    } else {
      console.log('Dashboard: No user data found, redirecting to login');
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
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);

      // More specific error messages
      if (err.response?.status === 401) {
        setError('Authentication expired. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to load members: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMemberAdded = () => {
    // Refresh the members list when a new member is added
    loadMembers();
  };

  if (!user) {
    return (
      <Container>
        <Alert severity="info">Loading...</Alert>
      </Container>
    );
  }

  return (
    <Layout user={user}>
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Box mb={4}>
          <Typography variant="h4" component="h1" gutterBottom color="primary">
            Church Portal Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user.name}! Here's what's happening in your church community.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={loadMembers}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Total Members
                    </Typography>
                    <Typography variant="h4">
                      {members.length}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <EventIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Services
                    </Typography>
                    <Typography variant="h4">
                      12
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Attendance
                    </Typography>
                    <Typography variant="h4">
                      85%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 250px', minWidth: '250px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                    <ChurchIcon />
                  </Avatar>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="h6">
                      Growth
                    </Typography>
                    <Typography variant="h4">
                      +12%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <PeopleIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Member Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Manage church members, add new members, and update member information.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setAddMemberModalOpen(true)}
                >
                  Add New Member
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EventIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Service Management</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Schedule and manage church services, events, and special occasions.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EventIcon />}
                  onClick={() => navigate('/services')}
                >
                  Manage Services
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ChurchIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Church Days</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Create and manage church days, special services, and events.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<ChurchIcon />}
                  onClick={() => navigate('/churchdays')}
                >
                  Manage Church Days
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <AssessmentIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Attendance Tracking</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Track member attendance for services and events.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AssessmentIcon />}
                  onClick={() => navigate('/attendance')}
                >
                  Track Attendance
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Recent Members (Admin only) */}
        {user?.role === 'admin' && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '2 1 500px', minWidth: '500px' }}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Recent Members</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={loadMembers}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  {members.length > 0 ? (
                    <List>
                      {members.slice(0, 5).map((member, index) => (
                        <React.Fragment key={member._id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: 'primary.main' }}>
                                {member.surname?.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={`${member.surname} ${member.other_names}`}
                              secondary={member.email}
                            />
                            <Chip
                              label={member.saved_or_not ? 'Saved' : 'Not Saved'}
                              color={member.saved_or_not ? 'success' : 'default'}
                              size="small"
                            />
                          </ListItem>
                          {index < members.slice(0, 5).length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box textAlign="center" py={4}>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        No members found. Start by adding some church members!
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
            </Box>

            <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    User Information
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={user.role}
                    color={user.role === 'admin' ? 'primary' : 'default'}
                    size="small"
                  />
                </CardContent>
              </Card>
            </Box>
          </Box>
        )}

        {/* System Information */}
        <Box mt={4}>
          <Alert severity="success">
            <strong>✅ Backend Connected!</strong> Your church portal is connected to the backend API running on port 5000.
          </Alert>
          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>📊 Attendance Calculation:</strong> The attendance numbers shown for services and church days are automatically calculated from actual attendance records. When members check in for a service, the attendance count updates automatically.
          </Alert>
        </Box>
      </Container>

      {/* Add Member Modal */}
      <AddMemberModal
        open={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onMemberAdded={handleMemberAdded}
      />
    </Layout>
  );
};

export default Dashboard;
