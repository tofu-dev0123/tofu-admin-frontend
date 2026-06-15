'use client';

import { useState } from 'react';

function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickHamburgerMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="w-5 h-5 flex flex-col justify-center items-center gap-1 relative cursor-pointer"
      onClick={handleClickHamburgerMenu}
    >
      <span
        className={`absolute top-1 left-[50%] translate-x-[-50%] w-full h-0.5 bg-gray-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-[135deg] translate-y-[5px]' : 'rotate-0'}`}
      ></span>
      <span
        className={`absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-0.5 bg-gray-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`}
      ></span>
      <span
        className={`absolute bottom-1 left-[50%] translate-x-[-50%] w-full h-0.5 bg-gray-900 rounded-full transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-[-135deg] translate-y-[-5px]' : 'rotate-0'}`}
      ></span>
    </div>
  );
}

export default HamburgerMenu;
