import './SignupForm.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';

const SignupFormPage = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmedPassword) {
      setErrors({});
      const payload = {
        username,
        firstName,
        lastName,
        email,
        password,
        confirmedPassword,
      };

      return dispatch(sessionActions.signup(payload)).catch(async (res) => {
        const data = await res.json();
        if (data?.errors) {
          setErrors(data.errors);
        }
      });
    }
    return setErrors({
      confirmPassword:
        'Confirm Password field must be the same as the Password field',
    });
  };

  if (sessionUser) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div>
      <h1>Signup Form Page</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            ></input>
          </label>
          <label>
            First Name
            <input
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            ></input>
          </label>
          <label>
            Last Name
            <input
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            ></input>
          </label>
          <label>
            Email
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
          </label>
          <label>
            Password
            <input
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
          </label>
          <label>
            Confirm Password
            <input
              placeholder="Confrim Password"
              onChange={(e) => setConfirmedPassword(e.target.value)}
              value={confirmedPassword}
            ></input>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignupFormPage;
