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

// 🔑 Quản lý access + refresh token (thay cho cookie httpOnly trước đây).
// Lưu ở localStorage vì client/admin và server nằm ở domain khác nhau khi
// deploy thật (Vercel/Netlify <-> Render) — cookie cross-site hay bị trình
// duyệt chặn (đặc biệt là Safari/Chrome mới), gây ra lỗi "đăng nhập Google
// xong lại bị văng về trang chủ".
//
// Access token sống ngắn (30 phút) để giảm thiệt hại nếu bị lộ; refresh
// token sống dài (30 ngày) và chỉ dùng để xin access token mới. apiFetch()
// tự động phát hiện access token hết hạn và refresh ngầm, người dùng không
// cảm nhận được (không bị văng ra khỏi trang khi đang dùng).
const ACCESS_TOKEN_KEY = "authAccessToken";
const REFRESH_TOKEN_KEY = "authRefreshToken";

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (token) =>
  localStorage.setItem(REFRESH_TOKEN_KEY, token);

export const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) setToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
};

export const removeToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Nhiều request có thể cùng lúc gặp access token hết hạn (VD: 5 lời gọi
// API song song khi vào trang) — dùng 1 promise dùng chung để chỉ gọi
// /refresh MỘT lần, các request còn lại "xếp hàng" chờ chung kết quả thay
// vì mỗi request tự refresh riêng (vừa lãng phí vừa có thể gây race
// condition ở refresh-token-rotation phía server).
let refreshPromise = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("Không có refresh token");

      const res = await fetch(apiUrl("/api/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        removeToken();
        throw new Error("Refresh token hết hạn, cần đăng nhập lại");
      }
      const data = await res.json();
      setTokens(data);
      return data.accessToken;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Wrapper quanh fetch() tự động gắn header "Authorization: Bearer <token>"
 * và tự làm mới access token khi hết hạn (401 + code TOKEN_EXPIRED), sau
 * đó tự động thử lại request 1 lần.
 * Dùng thay cho fetch(apiUrl(...), { credentials: "include", ... }) trước đây.
 *
 * Cách dùng:
 *   const res = await apiFetch("/api/products");
 *   const res = await apiFetch("/api/orders", { method: "POST", body: JSON.stringify(data) });
 *
 * Với FormData (upload ảnh...), KHÔNG tự set Content-Type để browser tự
 * thêm boundary đúng — chỉ cần truyền options.body là FormData như bình thường.
 */
export async function apiFetch(path, options = {}, _retried = false) {
  const token = getToken();
  const headers = { ...(options.headers || {}) };

  if (token) headers.Authorization = `Bearer ${token}`;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(apiUrl(path), { ...options, headers });

  // Access token hết hạn → thử refresh rồi gọi lại request 1 lần duy nhất
  // (tránh vòng lặp vô hạn nếu refresh cũng fail).
  if (res.status === 401 && !_retried && getRefreshToken()) {
    let body;
    try {
      body = await res.clone().json();
    } catch {
      body = null;
    }
    if (body?.code === "TOKEN_EXPIRED") {
      try {
        await refreshAccessToken();
        return apiFetch(path, options, true);
      } catch {
        removeToken();
      }
    }
  }

  return res;
}

export default apiUrl;
