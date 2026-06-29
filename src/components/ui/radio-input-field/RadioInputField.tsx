import classNames from 'classnames';
import './RadioInputField.css';

interface IRadioInputFieldProps {
    id: string;
    name: string;
    value: string;
    label: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}   

const RadioInputField = ({ id, name, value, label, checked, onChange }: IRadioInputFieldProps) => {
    const itemClasses = classNames('radio-input-item', {
        '__checked': checked
    });
    return (
        <div className={itemClasses}>
            <input
                className='radio-input-field'
                type='radio'
                id={id}
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
};

export default RadioInputField;