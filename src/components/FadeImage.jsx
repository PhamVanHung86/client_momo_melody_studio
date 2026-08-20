import { forwardRef, useEffect, useRef, useState } from "react";

/**
 * FadeImage — thẻ <img> tự động fade-in mượt khi tải xong, thay vì hiện ra
 * đột ngột ("nháy"). Dùng chung cho mọi nơi hiển thị ảnh sản phẩm/gallery
 * trong app (ProductItem, MailClub, v.v.) để không phải lặp lại cùng 1
 * đoạn logic ở từng trang.
 *
 * Props riêng so với <img> thường:
 *  - duration: thời gian fade (ms), mặc định 400
 *  - targetOpacity: độ mờ khi ảnh đã tải xong, mặc định 1 (dùng 0.5 cho
 *    trường hợp như ảnh hết hàng cần luôn mờ hơn bình thường)
 *
 * Hỗ trợ forwardRef để nơi gọi vẫn lấy được DOM node <img> gốc khi cần
 * (VD: ProductItem cần ref để truyền vào hiệu ứng flyToCart).
 *
 * Tự reset trạng thái mỗi khi `src` đổi — quan trọng cho các chỗ tái sử
 * dụng cùng 1 thẻ <img> nhưng đổi ảnh khác (VD: lightbox phóng to trong
 * MailClub), nếu không reset thì ảnh mới sẽ hiện ngay lập tức không fade.
 */
const FadeImage = forwardRef(function FadeImage(
  {
    src,
    alt = "",
    className = "",
    style,
    duration = 400,
    targetOpacity = 1,
    onLoad,
    ...rest
  },
  forwardedRef,
) {
  const [loaded, setLoaded] = useState(false);
  const innerRef = useRef(null);

  // Vừa giữ ref nội bộ để tự kiểm tra `.complete`, vừa forward ra ngoài cho
  // component cha (nếu có) — cả hai cùng trỏ vào đúng 1 DOM node.
  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  useEffect(() => {
    setLoaded(false);
    // Ảnh có thể đã nằm sẵn trong cache (VD: đổi src sang ảnh đã xem trước
    // đó) -> sự kiện onLoad có thể không bắn lại, cần tự kiểm tra.
    if (innerRef.current?.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <img
      ref={setRefs}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{
        opacity: loaded ? targetOpacity : 0,
        transition: `opacity ${duration}ms ease-out`,
        ...style,
      }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      {...rest}
    />
  );
});

export default FadeImage;
