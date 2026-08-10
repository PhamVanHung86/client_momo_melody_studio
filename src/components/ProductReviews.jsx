import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/client";

const Star = ({ filled }) => (
  <span className={filled ? "text-[#FFB800]" : "text-[#4A4A6A]/20"}>★</span>
);

const StarRating = ({ value, onChange, size = "text-base" }) => (
  <div className={`flex gap-0.5 ${size}`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        disabled={!onChange}
        className={onChange ? "cursor-pointer" : "cursor-default"}
      >
        <Star filled={n <= value} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId, ratingAvg = 0, ratingCount = 0 }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await apiFetch(`/api/reviews/product/${productId}`);
      const data = await res.json();
      if (data.success) setReviews(data.reviews);
    } catch (err) {
      console.error("Lỗi lấy đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const myReview = reviews.find((r) => r.user?._id === user?.id);

  useEffect(() => {
    if (myReview) {
      setMyRating(myReview.rating);
      setMyComment(myReview.comment || "");
    }
  }, [myReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      setError("Vui lòng chọn số sao");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/reviews/product/${productId}`, {
        method: "PUT",
        body: JSON.stringify({ rating: myRating, comment: myComment }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchReviews();
      } else {
        setError(data.message || "Có lỗi xảy ra");
      }
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 border-t border-[#FFD6E0]/40 pt-8">
      <h2 className="text-xl font-bold text-[#4A4A6A] mb-1">Đánh giá sản phẩm</h2>
      {ratingCount > 0 ? (
        <div className="flex items-center gap-2 mb-6">
          <StarRating value={Math.round(ratingAvg)} />
          <span className="text-sm text-[#4A4A6A]/70">
            {ratingAvg.toFixed(1)}/5 ({ratingCount} đánh giá)
          </span>
        </div>
      ) : (
        <p className="text-sm text-[#4A4A6A]/50 mb-6">Chưa có đánh giá nào</p>
      )}

      {/* Form đánh giá — chỉ hiện khi đã đăng nhập, server sẽ tự kiểm tra
          đã mua hàng chưa (verified purchase) khi submit */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFF7FA] rounded-2xl p-4 mb-6 border border-[#FFD6E0]/50"
        >
          <p className="text-sm font-medium text-[#4A4A6A] mb-2">
            {myReview ? "Sửa đánh giá của bạn" : "Viết đánh giá của bạn"}
          </p>
          <StarRating value={myRating} onChange={setMyRating} size="text-xl" />
          <textarea
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
            rows={3}
            maxLength={1000}
            className="w-full mt-3 p-3 rounded-xl border border-[#FFD6E0]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B81]/40 resize-none"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 bg-[#FF6B81] text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-[#FF5069] transition-colors disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : myReview ? "Cập nhật" : "Gửi đánh giá"}
          </button>
          <p className="text-[11px] text-[#4A4A6A]/40 mt-2">
            Bạn cần đã mua sản phẩm này để có thể đánh giá.
          </p>
        </form>
      ) : (
        <p className="text-sm text-[#4A4A6A]/60 mb-6">
          <Link to="/login" className="text-[#FF6B81] font-medium">
            Đăng nhập
          </Link>{" "}
          để viết đánh giá
        </p>
      )}

      {/* Danh sách đánh giá */}
      {loading ? (
        <p className="text-sm text-[#4A4A6A]/40">Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-[#4A4A6A]/40">
          Hãy là người đầu tiên đánh giá sản phẩm này!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="border-b border-[#FFD6E0]/30 pb-4 last:border-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#4A4A6A]">
                  {r.user?.name || "Ẩn danh"}
                </span>
                <StarRating value={r.rating} />
              </div>
              {r.comment && (
                <p className="text-sm text-[#4A4A6A]/70">{r.comment}</p>
              )}
              <p className="text-[11px] text-[#4A4A6A]/35 mt-1">
                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
