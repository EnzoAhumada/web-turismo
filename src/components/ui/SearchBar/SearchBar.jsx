import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import './SearchBar.css';

export default function SearchBar({
  placeholder = 'Buscar lugares, rutas, experiencias...',
  initialValue = '',
  onSearch,
}) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (onSearch) {
      onSearch(trimmed);
    } else if (trimmed) {
      navigate(`/explorar?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/explorar');
    }
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <span className="search-bar__icon" aria-hidden="true">
        <Icon name="search" size={18} strokeWidth={2} />
      </span>
      <input
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (onSearch && e.target.value === '') onSearch('');
        }}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={(e) => {
            e.preventDefault();
            setValue('');
            if (onSearch) onSearch('');
          }}
          aria-label="Limpiar búsqueda"
        >
          <Icon name="x" size={16} />
        </button>
      )}
      <button type="submit" className="search-bar__submit">Buscar</button>
    </form>
  );
}
