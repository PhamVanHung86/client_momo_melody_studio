/**
 * Tạo hiệu ứng ảnh bay từ nút bấm vào Icon giỏ hàng trên Navbar
 * @param {React.RefObject} imgRef - Ref trỏ tới thẻ <img> của sản phẩm
 * @param {string} cartSelector - Selector ID của giỏ hàng (mặc định '#nav-cart-icon')
 */
export const flyToCart = (imgRef, cartSelector = "#nav-cart-icon") => {
  const cartIcon = document.querySelector(cartSelector);

  if (!imgRef?.current || !cartIcon) return;

  // 🕒 THỜI GIAN BAY (mili-giây):
  // - 1200 = 1.2 giây (Mượt & Nhẹ nhàng)
  // - Nếu muốn chậm hơn nữa, bạn thử chỉnh lên 1500 (1.5 giây) nhé!
  const DURATION = 1200;

  // 1. Lấy tọa độ thực tế trên màn hình
  const imgRect = imgRef.current.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // 2. Tạo thẻ <img> tạm thời
  const flyImg = document.createElement("img");
  flyImg.src = imgRef.current.currentSrc || imgRef.current.src;

  Object.assign(flyImg.style, {
    position: "fixed",
    top: `${imgRect.top}px`,
    left: `${imgRect.left}px`,
    width: `${imgRect.width}px`,
    height: `${imgRect.height}px`,
    zIndex: "999999",
    pointerEvents: "none",
    borderRadius: "1.5rem",
    objectFit: "cover",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
    // Áp dụng thời gian bay DURATION
    transition: `all ${DURATION / 1000}s cubic-bezier(0.25, 1, 0.5, 1)`,
  });

  document.body.appendChild(flyImg);

  // 3. Kích hoạt bay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      Object.assign(flyImg.style, {
        top: `${cartRect.top + 2}px`,
        left: `${cartRect.left + 2}px`,
        width: "20px",
        height: "20px",
        opacity: "0.2",
        transform: "rotate(360deg) scale(0.6)",
      });
    });
  });

  // 4. Dọn dẹp DOM sau khi bay xong
  setTimeout(() => {
    if (document.body.contains(flyImg)) {
      document.body.removeChild(flyImg);
    }

    // Hiệu ứng nhún nhẹ cho icon giỏ hàng khi ảnh bay tới
    cartIcon.classList.add("animate-bounce");
    setTimeout(() => {
      cartIcon.classList.remove("animate-bounce");
    }, 400);
  }, DURATION);
};
