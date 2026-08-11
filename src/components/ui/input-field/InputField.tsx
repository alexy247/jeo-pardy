import classNames from 'classnames';

import { forwardRef, InputHTMLAttributes, useId } from 'react';

import './InputField.css';

interface IInputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    type: string;
    label: string;
    isWide?: boolean;
    required?: boolean;
    autofocus?: boolean;
}

const InputField = forwardRef<HTMLInputElement, IInputFieldProps>(
    ({ type, label, isWide = false, required = false, autofocus = false }, ref) => {
    const id = useId();
    const rowClasses = classNames('row', {
        '__is-wide': isWide
    });
    return (
        <div className={rowClasses}>
            <label className='label' htmlFor={id}>
                {label}
            </label>
            <input className='input' name={id} ref={ref} type={type} id={id} autoFocus={autofocus} required={required} />
        </div>
    );
});

export default InputField;