type typeValidationError = {
  [key: string]: any;
};

const uniqueCheck = async (isUnique: any) => {
  let validationError: typeValidationError = {};
  Object.keys(isUnique).forEach((key) => {
    validationError[key] = `"${isUnique[key]}" is already been taken.`;
  });
  return validationError;
};

const modelValidationCheck = async (errors: any) => {
  let validationError: typeValidationError = {};
  errors && Object.keys(errors).forEach((key) => {
    validationError[errors[key].path] = errors[key].message;
  });
  return validationError;
};

export { uniqueCheck, modelValidationCheck };
