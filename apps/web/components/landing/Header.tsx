'use client';
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white py-5 border-b border-gray-100">
      <div className="relative z-40 w-full flex items-center justify-between px-8">
        {/* Logo - Simple text logo */}
        <a href="/" className="font-bold text-base">
fabrica®
        </a>

        {/* Desktop Navigation items - Horizontally distributed */}
        <div className="hidden md:flex flex-1 items-center justify-evenly">
          <a href="#studio" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
            Studio
          </a>
          <a href="#projects" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200 flex items-center">
            Projects <span className="ml-1 text-xs font-bold">27</span>
          </a>
          <a href="#blog" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
            Blog
          </a>
          <a href="#contact" className="font-bold text-base text-black hover:text-gray-600 transition-colors duration-200">
            Contact
          </a>
        </div>

        {/* Menu Icon - Wider version */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-1 transition-colors duration-200 z-50">
          <svg width="28" height="14" viewBox="0 0 28 14" fill="none" className="text-black">
            <path d="M0 7h28M0 1h28M0 13h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Slide-down Menu */}
      <div
        className={`absolute top-0 left-0 right-0 bg-white border-b border-gray-100 transition-transform duration-500 ease-in-out ${isMenuOpen ? 'transform translate-y-0' : 'transform -translate-y-full'}`}
        style={{ zIndex: 20, paddingTop: '80px' }}
      >
        <div className="container mx-auto px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2 flex flex-col gap-6">
              <h3 className="text-gray-400 text-sm font-bold">Menu</h3>
              <a href="#studio" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Studio</a>
              <a href="#projects" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Projects</a>
              <a href="#blog" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Blog</a>
              <a href="#contact" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Contact</a>
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-gray-400 text-sm font-bold">Get Started</h3>
              <a href="/login" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Login</a>
              <a href="/signup" className="font-bold text-2xl text-black hover:text-gray-600 transition-colors duration-200">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;