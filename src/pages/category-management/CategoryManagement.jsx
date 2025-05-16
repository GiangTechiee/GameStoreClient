import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CategoryModal from './CategoryModal';
import CategoryTable from './CategoryTable';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const navigate = useNavigate();

  // Check admin role
  const userRole = localStorage.getItem('role');
  useEffect(() => {
    if (userRole !== 'Admin') {
      toast.error('Access denied. Admins only.', { autoClose: 2000 });
      navigate('/');
    }
  }, [userRole, navigate]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiRequest('/category');
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load categories: ' + err.message);
        setLoading(false);
      }
    };
    if (userRole === 'Admin') {
      fetchCategories();
    }
  }, [userRole]);

  // Open modal for adding
  const openAddModal = () => {
    setModalMode('add');
    setNewCategory({ name: '', description: '' });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal  = (category) => {
    setModalMode('edit');
    setEditingCategory({
      categoryId: category.categoryId,
      name: category.name,
      description: category.description || '',
    });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setNewCategory({ name: '', description: '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentCategory = modalMode === 'add' ? newCategory : editingCategory;
    try {
      if (modalMode === 'add') {
        const response = await apiRequest('/category', 'POST', {
          name: currentCategory.name,
          description: currentCategory.description || null,
        });
        setCategories([...categories, response]);
        toast.success('Category added successfully!');
      } else {
        await apiRequest(`/category/${currentCategory.categoryId}`, 'PUT', {
          categoryId: currentCategory.categoryId,
          name: currentCategory.name,
          description: currentCategory.description || null,
        });
        setCategories(
          categories.map((cat) =>
            cat.categoryId === currentCategory.categoryId ? currentCategory : cat
          )
        );
        toast.success('Category updated successfully!');
      }
      closeModal();
    } catch (err) {
      toast.error(`Failed to ${modalMode === 'add' ? 'add' : 'update'} category: ${err.message}`);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiRequest(`/category/${id}`, 'DELETE');
        setCategories(categories.filter((cat) => cat.categoryId !== id));
        toast.success('Category deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete category: ' + err.message);
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
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Quản lý thể loại</h1>
      <CategoryTable
        categories={categories}
        openEditModal={openEditModal}
        handleDeleteCategory={handleDeleteCategory}
        openAddModal={openAddModal}
      />
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        category={modalMode === 'add' ? newCategory : editingCategory}
        setCategory={modalMode === 'add' ? setNewCategory : setEditingCategory}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default CategoryManagement;