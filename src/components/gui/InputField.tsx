interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value, onChange }) => (
    <div className="flex flex-col items-center">
        <label htmlFor={label.toLowerCase()} className="block mb-3 text-lg font-semibold"><p>{label}</p></label>
        <input type="text" name={label.toLowerCase()} placeholder={placeholder} value={value} onChange={onChange} className="w-3/5 mt-2 px-3 py-2 border rounded text-center" />
    </div>
);