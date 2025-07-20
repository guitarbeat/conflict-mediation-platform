import React from "react";

const FormField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "input",
  rows = 3,
  className = "",
  description = "",
}) => {
  return (
    <div className="form-field">
      <label htmlFor={id} className={`form-label ${className}`}>
        {label}
      </label>
      {description && <p className="form-description">{description}</p>}
      {type === "textarea" ? (
        <textarea
          id={id}
          className="form-input form-textarea"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
        />
      ) : (
        <input
          id={id}
          type={type}
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default FormField;
