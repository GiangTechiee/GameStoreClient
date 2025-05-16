import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserModal from "./UserModal";
import UserTable from "./UserTable";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    roleId: '',
  });
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  // Check admin role
  useEffect(() => {
    if (localStorage.getItem('role') !== 'Admin') {
      toast.error('Access denied. Admins only.', { autoClose: 2000 });
      navigate('/');
    }
  }, [navigate]);

  // Fetch users and roles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          apiRequest('/user'),
          apiRequest('/role'),
        ]);
        setUsers(usersData);
        setRoles(rolesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data: ' + err.message);
        setLoading(false);
      }
    };
    if (localStorage.getItem('role') === 'Admin') {
      fetchData();
    }
  }, []);

  // Open modal for adding
  const openAddModal = () => {
    setModalMode('add');
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      password: '',
      roleId: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingUser({
      userId: user.userId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      roleId: roles.find((role) => role.roleName === user.role)?.roleId || '',
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setNewUser({
      username: '',
      email: '',
      fullName: '',
      password: '',
      roleId: '',
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = modalMode === 'add' ? newUser : editingUser;
    try {
      if (modalMode === 'add') {
        const response = await apiRequest('/user', 'POST', {
          username: currentUser.username,
          email: currentUser.email,
          fullName: currentUser.fullName,
          password: currentUser.password,
          roleId: parseInt(currentUser.roleId),
        });
        setUsers([...users, response]);
        toast.success('User added successfully!');
      } else {
        const response = await apiRequest(`/user/${currentUser.userId}`, 'PUT', {
          userId: currentUser.userId,
          username: currentUser.username,
          email: currentUser.email,
          fullName: currentUser.fullName,
          roleId: parseInt(currentUser.roleId),
        });
        setUsers(
          users.map((user) =>
            user.userId === currentUser.userId
              ? {
                  ...response,
                  role: roles.find((r) => r.roleId === parseInt(currentUser.roleId))?.roleName,
                }
              : user
          )
        );
        toast.success('User updated successfully!');
      }
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${modalMode === 'add' ? 'add' : 'update'} user: ${err.message}`);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiRequest(`/user/${id}`, 'DELETE');
        setUsers(users.filter((user) => user.userId !== id));
        toast.success('User deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete user: ' + err.message);
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">User Management</h1>
      <UserTable
        users={users}
        openEditModal={openEditModal}
        handleDeleteUser={handleDeleteUser}
        openAddModal={openAddModal}
      />
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        user={modalMode === 'add' ? newUser : editingUser}
        setUser={modalMode === 'add' ? setNewUser : setEditingUser}
        onSubmit={handleSubmit}
        roles={roles}
      />
    </div>
  );
}

export default UserManagement;
