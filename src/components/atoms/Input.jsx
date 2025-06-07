import React from 'react';

const Input = ({ id, type = 'text', value, onChange, placeholder, className, disabled, ...rest }) => {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
            disabled={disabled}
            {...rest}
        />
    );
};

export default Input;