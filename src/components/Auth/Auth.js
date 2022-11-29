import React from 'react';
// import { useContext, useState } from 'react';
// import { NavLink, Redirect, useParams } from 'react-router-dom';
// import { UserContext } from '../../context/UserContext.js';
// import { authUser } from '../../services/auth.js';

// export default function Auth() {
//   const { type } = useParams();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const { user, setUser } = useContext(UserContext);

//   const submitAuth = async () => {
//     const userResponse = await authUser(email, password, type);
//     setUser(userResponse);
//     setEmail('');
//     setPassword('');
//   };

//   if (user) {
//     return <Redirect to="/home" />;
//   }

//   return (
//     <div>
//       <div>
//         <NavLink to="/auth/sign-in">Sign In</NavLink>
//         <NavLink to="/auth/sign-up">Sign Up</NavLink>
//       </div>
//       <div>
//         <label>Email:</label>
//         <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
//       </div>
//       <div>
//         <label>Password:</label>
//         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
//       </div>
//       <button onClick={submitAuth}>Submit</button>
//     </div>
//   );
// }

export default function Auth() {
  return (
    <div>
      <h1>hello you made it!</h1>
      <h2>yay!!</h2>
    </div>
  );
}
