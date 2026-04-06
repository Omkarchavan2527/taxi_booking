import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { searchAddress, type GeocodeResult } from '../../utils/geocoding';

interface LocationSearchProps {
  placeholder: string;
  onSelect: (location: GeocodeResult) => void;
  defaultValue?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ placeholder, onSelect, defaultValue = '' }) => {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2 && query !== defaultValue) {
        setIsSearching(true);
        const data = await searchAddress(query);
        setResults(data);
        setShowDropdown(true);
        setIsSearching(false);
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500); // 500ms delay to prevent API spam

    return () => clearTimeout(timer);
  }, [query, defaultValue]);

  const handleSelect = (place: GeocodeResult) => {
    setQuery(place.address.split(',')[0]); // Set input to short name
    setShowDropdown(false);
    onSelect(place);
  };

  return (
    <div className="relative w-full z-50">
      <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded-xl flex items-center px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            className="w-full bg-transparent outline-none text-sm font-medium text-gray-900" 
          />
        </div>
        <Search size={18} className="text-gray-400" />
      </div>

      {/* Autocomplete Dropdown */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto custom-scrollbar overflow-hidden">
          {results.map((place, idx) => (
            <div 
              key={idx}
              onClick={() => handleSelect(place)}
              className="flex items-start p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
            >
              <div className="mt-0.5 text-gray-400 mr-3"><MapPin size={16} /></div>
              <div>
                <p className="text-sm font-bold text-gray-900 line-clamp-1">{place.address.split(',')[0]}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{place.address}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};