import React from "react";
import EnhancedFormField from "./EnhancedFormField";

const FormField = ({ className, labelClassName, inputClassName, containerClassName, ...props }) => {
  return (
    <EnhancedFormField
      {...props}
      variant="simple"
      className={inputClassName}
      labelClassName={labelClassName ?? className}
      containerClassName={containerClassName}
    />
  );
};

export default FormField;
