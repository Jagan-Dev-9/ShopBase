'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  className = "",
  disabled = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);
  const { isDark } = useTheme();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen && buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect());
      }
    };

    const handleResize = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`px-4 py-3 rounded-lg border backdrop-blur-md ${
        isDark 
          ? 'bg-white/10 border-white/20' 
          : 'bg-white/80 border-gray-300'
      } ${className}`}>
        {placeholder}
      </div>
    );
  }

  const selectedOption = options.find(option => option.value === value);

  const handleButtonClick = () => {
    if (!disabled) {
      if (!isOpen && buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect());
      }
      setIsOpen(!isOpen);
    }
  };

  const dropdownStyle = buttonRect ? {
    position: 'fixed',
    top: buttonRect.bottom + window.scrollY + 4,
    left: buttonRect.left + window.scrollX,
    width: buttonRect.width,
    zIndex: 9999
  } : {};

  return (
    <div className={`custom-dropdown relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
        className={`w-full px-4 py-3 pr-10 rounded-lg border backdrop-blur-md transition cursor-pointer text-left shadow-lg ${
          isDark 
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/15 focus:border-pink-400'
            : 'bg-white/80 border-gray-300 text-gray-900 hover:bg-white/90 focus:border-pink-500'
        } focus:outline-none focus:ring-2 focus:ring-pink-500/50 ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <span className={selectedOption ? '' : (isDark ? 'text-gray-300' : 'text-gray-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-white/70' : 'text-gray-500'}`} 
        />
      </button>

      {isOpen && mounted && createPortal(
        <div 
          ref={dropdownRef}
          style={dropdownStyle}
          className={`rounded-lg border backdrop-blur-md shadow-xl max-h-60 overflow-auto ${
            isDark 
              ? 'bg-gray-800/95 border-white/20' 
              : 'bg-white/95 border-gray-300'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition hover:bg-gradient-to-r ${
                isDark 
                  ? 'text-white hover:from-pink-500/20 hover:to-purple-500/20' 
                  : 'text-gray-900 hover:from-pink-50 hover:to-purple-50'
              } ${
                value === option.value 
                  ? isDark 
                    ? 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-200' 
                    : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700'
                  : ''
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {option.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
