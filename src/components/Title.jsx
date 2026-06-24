import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex gap-2 items-center mb-3">
      <p className="text-[#4A4A6A]/60 text-2xl sm:text-3xl">
        {text1}{" "}
        <span
          style={{ fontFamily: "'Dancing Script', cursive" }}
          className="text-[#4A4A6A] font-medium"
        >
          {text2}
        </span>
      </p>
      <p className="w-8 sm:w-12 h-[1.5px] bg-[#FFB7C5]"></p>
    </div>
  );
};

export default Title;
