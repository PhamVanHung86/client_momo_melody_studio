// Tối ưu ảnh Cloudinary ngay trên URL (không cần đụng vào server/upload lại).
//
// Vấn đề: ảnh sản phẩm được lưu ở kích thước tối đa 800x800 (xem
// server/config/cloudinary.js), nhưng nhiều nơi trên UI chỉ hiển thị ảnh
// nhỏ (VD: thẻ sản phẩm trong lưới chỉ rộng ~250-300px). Tải nguyên ảnh gốc
// cho mọi chỗ khiến trình duyệt phải tải + giải mã ảnh nặng hơn nhiều lần
// mức cần thiết → giật/lag khi cuộn, đặc biệt trên mobile/mạng chậm.
//
// Cloudinary hỗ trợ transform ảnh ngay trên URL (resize, đổi định dạng,
// nén...) và cache lại phiên bản đã transform ở CDN — không tốn thêm dung
// lượng lưu trữ, không cần sửa gì ở backend.
//
// Cách dùng:
//   <img src={cldUrl(product.image, { width: 400 })} />
//
// Nếu url không phải ảnh Cloudinary (VD: avatar Google, ảnh test cục bộ),
// hàm trả về nguyên url gốc — an toàn, không lỗi.
export function cldUrl(url, { width, height, quality = "auto", format = "auto" } = {}) {
  if (!url || typeof url !== "string") return url;
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url; // không phải Cloudinary → trả nguyên url
  }

  const parts = [`q_${quality}`, `f_${format}`, "c_limit"];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);

  const transform = parts.join(",");

  // Chèn transform ngay sau "/upload/", giữ nguyên phần còn lại của URL
  // (kể cả version "v1234567" nếu có).
  return url.replace("/upload/", `/upload/${transform}/`);
}

export default cldUrl;
