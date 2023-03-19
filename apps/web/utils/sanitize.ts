import escape from 'validator/es/lib/escape';
import stripLow from 'validator/es/lib/stripLow';

export const serverSanitize = (str: string): string => {
  return escape(stripLow(str));
};
