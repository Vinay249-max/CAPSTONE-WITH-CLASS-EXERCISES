import React, { useState, useEffect } from 'react';
import { FiShield, FiUser, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { getUsers, updateUserRole, deleteUser } from '../../services/userService';
import { Skeleton } from '../../components/common/Skeletons';
import { toast } from 'react-hot-toast';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (user) => {
    const newRole = user.roleId.roleName === 'admin' ? 'user' : 'admin';
    setUpdatingId(user._id);
    try {
      await updateUserRole(user._id, newRole);
      toast.success(`Role updated to ${newRole}`);
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.name}"? This action cannot be undone.`)) return;
    
    setUpdatingId(user._id);
    try {
      await deleteUser(user._id);
      toast.success('User deleted successfully');
      await fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} total users registered</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th style={{ width: 120 }}>Role</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td><Skeleton width={150} height={20} /></td>
                  <td><Skeleton width={200} height={20} /></td>
                  <td><Skeleton width={100} height={20} /></td>
                  <td><Skeleton width={80} height={20} /></td>
                  <td><Skeleton width={100} height={30} /></td>
                </tr>
              ))
            ) : (
              users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="user-avatar-mini">
                        {user.profilePicture ? (
                          <img src={`${process.env.REACT_APP_API_URL.replace('/api', '')}/${user.profilePicture}`} alt="" />
                        ) : (
                          <FiUser size={16} />
                        )}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{user.phone}</td>
                  <td>
                    <span className={`badge ${user.roleId.roleName === 'admin' ? 'badge-lime' : 'badge-muted'}`}>
                      {user.roleId.roleName === 'admin' ? <FiShield size={10} style={{ marginRight: 4 }} /> : null}
                      {user.roleId.roleName}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleRoleToggle(user)}
                        disabled={updatingId === user._id}
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        {updatingId === user._id ? (
                          <FiRefreshCw className="spin" size={14} />
                        ) : (
                          `Make ${user.roleId.roleName === 'admin' ? 'Customer' : 'Admin'}`
                        )}
                      </button>
                      <button
                        className="btn btn-danger btn-sm btn-icon"
                        onClick={() => handleDeleteUser(user)}
                        disabled={updatingId === user._id || user.roleId.roleName === 'admin'}
                        title={user.roleId.roleName === 'admin' ? "Cannot delete admin user" : "Delete User"}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .user-avatar-mini {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--bg-elevated);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden; border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .user-avatar-mini img { width: 100%; height: 100%; object-fit: cover; }
        
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .table-wrap {
          background: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden; overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default AdminUserManagement;
