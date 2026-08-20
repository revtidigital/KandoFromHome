import React, { useEffect, useRef, useState } from 'react';

interface SearchableSelectProps {
  id?: string;
  className?: string;
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  className,
  value,
  options,
  placeholder,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="searchable-select" ref={wrapperRef} style={{ position: 'relative' }}>
      <input
        id={id}
        type="text"
        className={`searchable-select__input${className ? ` ${className}` : ''}`}
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => { setOpen(true); setQuery(''); }}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={e => {
          if (e.key === 'Escape') { setOpen(false); setQuery(value); }
        }}
      />
      <svg
        className={`searchable-select__arrow${open ? ' searchable-select__arrow--open' : ''}`}
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      {open && (
        <ul className="searchable-select__list">
          {filtered.length === 0 && (
            <li className="searchable-select__empty">No matches</li>
          )}
          {filtered.map(opt => (
            <li
              key={opt}
              className="searchable-select__option"
              onMouseDown={() => {
                onChange(opt);
                setQuery(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
