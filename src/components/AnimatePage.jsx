import React from "react";
import { motion } from "framer-motion";

// Cấu hình kiểu chuyển động (Fade in + trượt nhẹ từ dưới lên)
const animations = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const AnimatePage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} // Hiệu ứng mượt dạng Cubic Bezier
    >
      {children}
    </motion.div>
  );
};

export default AnimatePage;
