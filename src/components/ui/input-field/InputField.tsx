import classNames from 'classnames';
import './InputField.css';

interface IInputFieldProps {
    id: string;
    type: string;
    label: string;
    isWide?: boolean;
    required?: boolean;
    autofocus?: boolean;
}

function InputField({ id, type, label, isWide = false, required = false, autofocus = false }: IInputFieldProps) {
    const rowClasses = classNames('row', {
        '__is-wide': isWide
    });
    return (
        <div className={rowClasses}>
            <label className='label' htmlFor={id}>
                {label}
            </label>
            <input className='input' type={type} id={id} autoFocus={autofocus} required={required} />
        </div>
    );
}

export default InputField;