import './InputField.css';

interface IInputFieldProps {
    id: string;
    type: string;
    label: string;
    autofocus?: boolean;
}

function InputField({ id, type, label, autofocus = false }: IInputFieldProps) {
    return (
        <div className='row'>
            <label className='label' htmlFor={id}>
                {label}
            </label>
            <input className='input' type={type} id={id} autoFocus={autofocus} />
        </div>
    );
}

export default InputField;