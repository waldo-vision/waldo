import validator from 'validator';

export const serverSanitize = (str: string): string => {
  return validator.escape(validator.stripLow(str));
};
