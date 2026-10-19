import { useEffect, useMemo, useRef, useState } from 'react';
import siteContent from '../content/siteContent.json';
import { getCountryOptions } from '../utils/phoneValidation';

const { forms } = siteContent;

/**
 * Dialling-code picker.
 *
 * Rebuilt as a proper listbox: the trigger owns the aria state, the list is
 * navigable with Up/Down/Home/End, Enter and Escape, and the active option
 * is kept scrolled into view. Closing returns focus to the trigger.
 */
export default function CountryCodeSelect({ value, onChange, id = 'country-code' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const wrapperRef = useRef(null);
  const triggerRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  const countries = getCountryOptions();
  const selected = countries.find((country) => country.code === value) || countries[0];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return countries;
    return countries.filter(
      (country) =>
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
    );
  }, [countries, search]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setSearch('');
    const index = Math.max(0, countries.findIndex((country) => country.code === value));
    setActiveIndex(index);
    // Focus the filter input so typing narrows the list immediately.
    window.requestAnimationFrame(() => searchRef.current?.focus());
  }, [isOpen, value, countries]);

  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const node = listRef.current.children[activeIndex];
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const close = (returnFocus = true) => {
    setIsOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const commit = (country) => {
    onChange(country.code);
    close();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(filtered.length - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const country = filtered[activeIndex];
      if (country) commit(country);
    }
  };

  const listboxId = `${id}-listbox`;

  return (
    <div className="bx-country" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="bx-country__trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={`${forms.countrySelect.label}: ${selected.name} ${selected.dialCode}`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (!isOpen && (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span aria-hidden="true">{selected.flag}</span>
        <span>{selected.dialCode}</span>
        <svg
          className="bx-country__chevron"
          width="10"
          height="7"
          viewBox="0 0 12 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1.5 6 6.5l5-5" />
        </svg>
      </button>

      {isOpen && (
        <div className="bx-country__panel" onKeyDown={handleKeyDown}>
          <input
            ref={searchRef}
            type="text"
            className="bx-input bx-country__search"
            placeholder={forms.countrySelect.searchPlaceholder}
            aria-label={forms.countrySelect.searchPlaceholder}
            aria-controls={listboxId}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setActiveIndex(0);
            }}
          />

          {filtered.length ? (
            <ul
              id={listboxId}
              ref={listRef}
              className="bx-country__list"
              role="listbox"
              aria-label={forms.countrySelect.label}
            >
              {filtered.map((country, index) => (
                <li key={country.code} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={country.code === value}
                    data-active={index === activeIndex}
                    className="bx-country__option"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => commit(country)}
                    tabIndex={-1}
                  >
                    <span aria-hidden="true">{country.flag}</span>
                    <span>{country.name}</span>
                    <span className="bx-country__dial">{country.dialCode}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="bx-country__empty">{forms.countrySelect.empty}</p>
          )}
        </div>
      )}
    </div>
  );
}
