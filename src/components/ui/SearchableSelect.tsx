import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Option {
  id: string | number;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  name?: string; // To support form data if needed
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  className,
  required,
  name
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={cn('w-full space-y-1.5', className)} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-dps-teal/20 focus:border-dps-teal transition-all text-left',
            !selectedOption && 'text-gray-400'
          )}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={16} className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={value} required={required} />

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="flex items-center border-b border-gray-100 px-3 py-2">
              <Search size={14} className="text-gray-400 mr-2" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="max-h-60 overflow-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors text-left',
                      option.id === value ? 'bg-dps-teal/5 text-dps-teal font-medium' : 'text-gray-700'
                    )}
                  >
                    <span>{option.label}</span>
                    {option.id === value && <Check size={14} />}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
