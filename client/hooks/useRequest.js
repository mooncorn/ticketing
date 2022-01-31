import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const send = async () => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(err.response.data.errors);
    }
  };

  const getFieldError = (fieldName) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  const getRequestErrors = () => {
    return errors.filter((error) => error.field === undefined);
  };

  return { send, getFieldError, getRequestErrors, errors };
};
