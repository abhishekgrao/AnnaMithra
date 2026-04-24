import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onIconClick?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightIcon, onIconClick, className = '', ...props }, ref) => {
    return (
      <div className={`input-wrapper ${className}`}>
        {label && <label className="input-label">{label}</label>}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input ref={ref} className={`input-field ${error ? 'input-error' : ''}`} {...props} />
          {rightIcon && (
            <button 
              type="button" 
              onClick={onIconClick}
              style={{
                position: 'absolute',
                right: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '4px',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.05)')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
            >
              {rightIcon}
            </button>
          )}
        </div>
        {error && <span className="input-error-msg">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
