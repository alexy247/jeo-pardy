import './InputField.css';

interface IInputFieldProps {
    id: string;
    type: string;
    label: string;
}

function InputField({ id, type, label }: IInputFieldProps) {
    return (
        <div className='row'>
            <label className='label' htmlFor={id}>
                {label}
            </label>
            <input className='input' type={type} id={id}/>
        </div>
    );
}

export default InputField;