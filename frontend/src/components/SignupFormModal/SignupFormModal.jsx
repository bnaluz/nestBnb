import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (
      username.length > 4 &&
      firstName &&
      lastName &&
      email &&
      password.length > 6 &&
      confirmedPassword
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [
    username.length,
    firstName,
    lastName,
    email,
    password.length,
    confirmedPassword,
  ]);

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
    <div className="modal-container">
      <h1 className="header">Signup Form Page</h1>
      <div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label className="label">Username</label>
          <input
            className="input"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          ></input>
          {errors.username && <p>{errors.username}</p>}
          <label className="label">First Name</label>
          <input
            className="input"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
          ></input>
          {errors.firstName && <p>{errors.firstName}</p>}
          <label className="label">Last Name</label>
          <input
            className="input"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          ></input>
          {errors.lastName && <p>{errors.lastName}</p>}
          <label className="label">Email</label>
          <input
            className="input"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          ></input>
          {errors.email && <p>{errors.email}</p>}
          <label className="label">Password</label>
          <input
            className="input"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          ></input>
          {errors.password && <p>{errors.password}</p>}
          <label className="label">Confirm Password</label>
          <input
            className="input"
            placeholder="Confrim Password"
            onChange={(e) => setConfirmedPassword(e.target.value)}
            value={confirmedPassword}
          ></input>
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          <button type="submit" disabled={disabled} className="submit-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupFormModal;
