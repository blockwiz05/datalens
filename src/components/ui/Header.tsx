import React from 'react';

const Header = ({ title }: any) => {
  return (
    <div
      className="bg-[rgba(249,250,251,0.1)] p-3 mb-6 text-center w-[500px] mx-auto rounded-[4px] border-1 border-green-500 shadow-md"
      style={{
        boxShadow: "0 0 15px 5px rgba(12, 1, 77, 0.6), 0 0 30px 15px rgba(12, 1, 77, 0.4)"
      }}
    >
      <h1 className="text-3xl font-bold text-green-300">{title}</h1>
    </div>
  );
};

export default Header;
