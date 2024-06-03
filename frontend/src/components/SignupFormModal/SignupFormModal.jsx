import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import { useModal } from '../../context/Modal';
import './SignupForm.css';

const SignupFormModal = () => {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

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

      return dispatch(sessionActions.signup(payload))
        .then(closeModal)
        .catch(async (res) => {
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
          {errors.username && <p>{errors.username}</p>}
          <label>
            First Name
            <input
              placeholder="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            ></input>
          </label>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label>
            Last Name
            <input
              placeholder="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            ></input>
          </label>
          {errors.lastName && <p>{errors.lastName}</p>}
          <label>
            Email
            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            ></input>
          </label>
          {errors.email && <p>{errors.email}</p>}
          <label>
            Password
            <input
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            ></input>
          </label>
          {errors.password && <p>{errors.password}</p>}
          <label>
            Confirm Password
            <input
              placeholder="Confrim Password"
              onChange={(e) => setConfirmedPassword(e.target.value)}
              value={confirmedPassword}
            ></input>
          </label>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SignupFormModal;
