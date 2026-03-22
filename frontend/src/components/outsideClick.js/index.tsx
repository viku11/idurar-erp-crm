import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from 'react';

interface DropdownProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (selectedValue: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ value, options, placeholder = 'Select', onChange }) => {
  const node = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState<boolean>(false);

  const handleClick = (e: globalThis.MouseEvent): void => {
    if (node.current && node.current.contains(e.target as Node)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const handleChange = (selectedValue: string): void => {
    onChange(selectedValue);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  return (
    <div ref={node} className="dropdown">
      <button className="dropdown-toggler" onClick={() => setOpen(!open)}>
        {value || placeholder}
      </button>
      {open && (
        <ul className="dropdown-menu">
          {options.map((opt: string) => (
            <li className="dropdown-menu-item" key={opt} onClick={() => handleChange(opt)}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
