import { useEffect, useRef, useState } from 'react';
import siteContent from '../content/siteContent.json';
import { getCountryOptions } from '../utils/phoneValidation';

const { forms } = siteContent;

export default function CountryCodeSelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  const countries = getCountryOptions();
  const selectedCountry = countries.find((country) => country.code === value) || countries[0];

  const filteredCountries = countries.filter((country) => {
    const query = search.toLowerCase();
    return !query || country.name.toLowerCase().includes(query);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="country-code-select" ref={wrapperRef} style={{ position: 'relative', width: '120px', flexShrink: 0 }}>
      <button
        type="button"
        className="form-select application-form-control"
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ width: '100%', textAlign: 'left', height: '2.8rem', whiteSpace: 'nowrap' }}
        title={`${selectedCountry.name} (${selectedCountry.code}) ${selectedCountry.dialCode}`}
      >
        {selectedCountry.flag} {selectedCountry.dialCode}
      </button>

      {isOpen && (
        <div
          className="country-code-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.25rem)',
            left: 0,
            right: 'auto',
            minWidth: '260px',
            zIndex: 1000,
            background: 'white',
            border: '1px solid #d9e2ef',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 24px rgba(17,45,78,0.16)',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '0.35rem'
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={forms.countrySelect.searchPlaceholder}
            className="form-control form-control-sm mb-2"
            style={{ fontSize: '0.9rem' }}
          />
          {filteredCountries.map((country) => (
            <button
              key={country.code}
              type="button"
              className="btn btn-light w-100 text-start"
              style={{ marginBottom: '0.2rem', fontSize: '0.9rem' }}
              onClick={() => {
                onChange(country.code);
                setIsOpen(false);
                setSearch('');
              }}
            >
              {country.flag} {country.name} ({country.code}) {country.dialCode}
            </button>
          ))}
          {!filteredCountries.length && <div className="text-muted small px-2 py-1">No countries found</div>}
        </div>
      )}
    </div>
  );
}
