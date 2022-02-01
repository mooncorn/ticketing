import { useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

export default () => {
  const { send } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    body: {},
    onSuccess: () => Router.push('/'),
  });

  useEffect(() => {
    send();
  }, []);

  return <div>Signing you out...</div>;
};
