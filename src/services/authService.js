import { apiRequest } from './api';

export const login = async ({ username, password }) => {
  try {
    const response = await apiRequest('/account/login', 'POST', { username, password });
    // Lưu userId và token
    localStorage.setItem('userId', response.userId);
    localStorage.setItem('token', response.token);
    localStorage.setItem('role', response.role); 

    // Đồng bộ guestCart với backend
    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    if (guestCart.length > 0) {
      for (const item of guestCart) {
        try {
          await apiRequest('/cart/add', 'POST', {
            userId: parseInt(response.userId),
            gameId: item.gameId,
            unitPrice: item.unitPrice,
          });
        } catch (err) {
          console.error(`Failed to sync cart item ${item.gameId}:`, err.message);
        }
      }
      // Xóa guestCart sau khi đồng bộ
      localStorage.removeItem('guestCart');
    }

    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed: ' + error.message);
  }
};

export const register = async ({ username, email, fullname, password, createAt}) => {
  try{
    const response = await apiRequest('/account/register', 'POST', {
      username,
      email,
      fullName,
      password,
      createdAt,
    });
    return response;
  } catch (error) {
    // Handle error here if needed
    throw new Error(error.response?.data?.message || 'Registration failed: ' + error.message);
  }
  
};