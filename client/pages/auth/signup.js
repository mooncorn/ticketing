import AuthForm from '../../components/authForm';

export default () => {
  return (
    <div>
      <h1 className="my-3">Sign Up</h1>
      <AuthForm url={'/api/users/signup'} />
    </div>
  );
};
