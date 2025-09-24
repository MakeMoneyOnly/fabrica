import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white py-5 border-b border-gray-100">
      <div className="relative z-10 w-full flex items-center justify-between px-8">
        {/* Logo - Simple text logo */}
        <a href="/" className="font-bold text-base">
          fabrica®
        </a>

        {/* Navigation items - Horizontally distributed */}
        <a href="#studio" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
          Studio
        </a>

        {/* Projects */}
        <a href="#projects" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200 flex items-center">
          Projects <span className="ml-1 text-xs font-bold">27</span>
        </a>

        {/* Blog */}
        <a href="#blog" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
          Blog
        </a>

        {/* Contact */}
        <a href="#contact" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
          Contact
        </a>

        {/* Menu Icon - Wider version */}
        <button className="p-1 transition-colors duration-200">
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="text-black">
            <path d="M0 7h28M0 1h28M0 13h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header; 
