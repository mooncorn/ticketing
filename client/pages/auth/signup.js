import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { send, errors } = useRequest({
    url: '/api/users/signup',
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

    console.log('data: ', data);
    console.log('errors: ', errors);
  };

  return (
    <form onSubmit={onSubmit}>
      <h1 className="mb-3">Sign Up</h1>

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
