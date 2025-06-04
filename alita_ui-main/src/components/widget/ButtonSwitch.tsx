import { Button } from '@mantine/core';
import { useEffect, useState } from 'react';
import './ButtonSwitch.css';

interface ButtonSwitchProps {
    options: Record<string, string | React.ReactNode>;
    defaultValue?: any
    label?: string
    onSelectionChange?: (value: string) => void;
}

const ButtonSwitch: React.FC<ButtonSwitchProps> = ({
    options,
    defaultValue,
    label,
    onSelectionChange,
}) => {
    const [selectedButton, setSelectedButton] = useState<string>(defaultValue);

    useEffect(()=>{
        setSelectedButton(defaultValue);
    }, [defaultValue])

    const handleButtonClick = (value: string) => {
        setSelectedButton(value);
        if (onSelectionChange) {
            onSelectionChange(value);
        }
    };

    const btnClass = (value: string) =>
        selectedButton === value ? 'btn-switch btn-switch-selected' : 'btn-switch';

    return (<div className='btn-switch-container'>
          <div className='text-sm pb-2 font-medium'>{label}</div>
        <div className='btn-switch-field-container flex items-center gap-3 p-1 rounded-lg'>
            {Object.entries(options).map(([value, label]) => (
                <Button
                    key={value}
                    className={btnClass(value)}
                    onClick={() => handleButtonClick(value)}>
                    {label}
                </Button>
            ))}
        </div>
    </div>
    );
};

export default ButtonSwitch;
