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
  error = "",
}) => {
  const inputProps = {
    id,
    className: "form-input" + (error ? " aria-invalid" : ""),
    placeholder,
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    "aria-invalid": !!error,
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className="form-field">
      <label htmlFor={id} className={`form-label ${className}`}>
        {label}
      </label>
      {description && <p className="form-description">{description}</p>}
      {type === "textarea" ? (
        <textarea {...inputProps} rows={rows} className="form-input form-textarea" />
      ) : (
        <input {...inputProps} type={type} />
      )}
      {error && (
        <p id={`${id}-error`} className="text-red-600 mt-1 text-xs">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
