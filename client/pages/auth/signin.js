import AuthForm from '../../components/authForm';

export default () => {
  return (
    <div>
      <h1 className="my-3">Sign In</h1>
      <AuthForm url={'/api/users/signin'} />
    </div>
  );
};
