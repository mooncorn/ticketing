import axios from 'axios';

const Landing = ({ currentUser }) => {
  console.log(currentUser);

  return <div>index</div>;
};

// Landing.getInitialProps = async () => {
//   try {
//     const response = await axios.get(
//       'http://ticketing.com/api/users/currentuser'
//     );

//     return response.data;
//   } catch (err) {
//     console.log(err);
//   }

//   return {};
// };

export default Landing;
