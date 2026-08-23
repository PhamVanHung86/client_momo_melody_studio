import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollUp}
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        backgroundColor: "#8B98E3",
      }}
      className="fixed bottom-8 right-8 z-50 w-11 h-11 rounded-full text-white shadow-md flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-all duration-300"
    >
      <img
        src="logo_blue.png"
        alt="Scroll to top"
        className="w-6 h-6 object-contain"
      />
    </button>
  );
};

export default ScrollToTop;
