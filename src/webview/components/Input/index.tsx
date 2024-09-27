interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ placeholder }: InputProps) {
    return <input placeholder={placeholder} className="p-2" type="text" />;
}

export default Input;
