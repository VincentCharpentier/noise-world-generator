import React, { ChangeEvent } from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
}

export const TextInput = ({ label, value, onChange }: TextInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);
  return (
    <label>
      <span>{label}</span>
      <input type='text' value={value} onChange={handleChange} />
    </label>
  );
};

interface SelectInputProps {
  label: string;
  value: string;
  options: Array<{ label: string; value: string } | string>;
  onChange: (newValue: string) => void;
  parse?: (value: string) => string;
  stringify?: (value: string) => string;
}
export function SelectInput({ label, value, options, onChange }: SelectInputProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value);
  return (
    <label>
      <span>{label}</span>
      <select onChange={handleChange} value={value}>
        {options.map((option, idx) => {
          const optValue = typeof option === 'string' ? option : option.value;
          const optLabel = typeof option === 'string' ? option : option.label;

          return (
            <option key={idx} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
    </label>
  );
}

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (newValue: number) => void;
}
export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value));
  return (
    <label>
      <span>{label}</span>
      <input type='range' value={value} min={min} max={max} step={step} onChange={handleChange} />
    </label>
  );
};

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
}
export const NumberInput: React.FC<NumberInputProps> = ({ label, value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value));
  return (
    <label>
      <span>{label}</span>
      <input type='number' value={value} onChange={handleChange} />
    </label>
  );
};

interface CheckboxInputProps {
  label: string;
  value: boolean;
  onChange: (newValue: boolean) => void;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);
  return (
    <label>
      <span>{label}</span>
      <input type='checkbox' checked={value} onChange={handleChange} />
    </label>
  );
};
