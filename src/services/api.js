import { toast } from "react-toastify";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const baseUrl = import.meta.env.VITE_API_URL || "https://gamestore-demo.onrender.com";
  const normalizedEndpoint = endpoint.startsWith("/api")
    ? endpoint
    : `/api${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;
  const url = `${baseUrl}${normalizedEndpoint}`;
  
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : "",
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // Xóa token và userId
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        // Hiển thị thông báo
        const errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
        
        toast.error(errorMessage, { autoClose: 2000 });
        // Trì hoãn chuyển hướng để hiển thị thông báo
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000); // Chờ 2 giây
        throw new Error(errorMessage);
      }

      if (response.status === 403) {
        const errorMessage = "Bạn không có quyền truy cập tài nguyên này.";
        toast.error(errorMessage, { autoClose: 2000 });
        setTimeout(() => {
          window.location.href = "/"; // Chuyển hướng về trang chủ
        }, 2000);
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      } else {
        const errorText = await response.text();
        throw new Error(`Non-JSON response: ${errorText.substring(0, 100)}...`);
      }
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }
    return {};
  } catch (error) {
    throw error;
  }
};
