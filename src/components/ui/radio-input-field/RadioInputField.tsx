import classNames from 'classnames';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

import './RadioInputField.css';


interface IRadioInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}   

const RadioInputField = forwardRef<HTMLInputElement, IRadioInputFieldProps>(
    ({ name, value, label, checked, onChange }, ref) => {
    const id = useId();
    const itemClasses = classNames('radio-input-item', {
        '__checked': checked
    });
    return (
        <div className={itemClasses}>
            <input
                className='radio-input-field'
                type='radio'
                id={id}
                ref={ref}
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label className='radio-input-label' htmlFor={id}>
                {label}
            </label>
        </div>
    );
});

export default RadioInputField;