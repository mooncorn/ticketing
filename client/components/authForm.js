import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../hooks/useRequest';

const AuthForm = ({ url }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { send, errors } = useRequest({
    url,
    method: 'post',
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    const data = await send();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group mb-2">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group mb-2">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {errors && (
        <div className="alert alert-danger mb-2">
          <h4>Oops...</h4>
          <ul>
            {errors.map((error) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default AuthForm;
