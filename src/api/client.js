// Lớp gọi API tập trung cho toàn bộ client (trang khách hàng).
//
// Toàn bộ URL backend trước đây bị hard-code "http://localhost:4000" rải
// rác ở hơn 20 chỗ trong code. Giờ chỉ cấu hình MỘT nơi duy nhất: biến môi
// trường VITE_API_URL (xem file .env / .env.example).
//
// Cách dùng:
//   import { apiUrl } from "../api/client";
//   const res = await fetch(apiUrl("/api/products"));

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

/** Ghép base URL với một đường dẫn API tương đối, ví dụ "/api/products" */
export function apiUrl(path) {
  if (/^https?:\/\//.test(path)) return path; // đã là URL đầy đủ thì giữ nguyên
  return `${BASE_URL}${path}`;
}

export default apiUrl;
