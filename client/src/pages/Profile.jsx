import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import HeroHeader from '../components/HeroHeader';
import api from '../utils/api';
import './Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  // Profile fields
  const [name, setName] = useState(user?.name || '');
  const [studentId, setStudentId] = useState(user?.student_id || '');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await api.patch('/auth/profile', { name, student_id: studentId });
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';

  return (
    <HeroHeader variant="dark" className="profile-page">
      <Navbar variant="dark" />
      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">{initial}</div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className="profile-role">{user?.role}</span>
        </div>

        <div className="profile-grid">
          {/* Edit Profile */}
          <div className="profile-card glass">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="profile-field">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="profile-field">
                <label>Student ID</label>
                <input type="text" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="7-digit Student ID" />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input type="email" value={user?.email || ''} disabled />
              </div>
              <button type="submit" className="btn-primary" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="profile-card glass">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="profile-field">
                <label>Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
              </div>
              <div className="profile-field">
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <div className="profile-field">
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn-primary" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </HeroHeader>
  );
}
