type typeValidationError = {
  [key: string]: any;
}[];

const uniqueCheck = async <T>(isUnique: T) => {
  let validationError: typeValidationError;
  Object.keys(isUnique).forEach((key) => {
    validationError[key] = `"${isUnique[key]}" is already been taken.`;
  });
  return validationError;
};

const requiredCheck = async <T>(errors: T) => {
  let validationError: object;
  Object.keys(errors).forEach((key) => {
    validationError[errors[key].path] = errors[key].message;
  });
  return validationError;
};

export { uniqueCheck, requiredCheck };
