import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginFormModal = () => {
  const dispatch = useDispatch();

  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        navigate('/');
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  useEffect(() => {
    if (password.length >= 6 && credential.length >= 4) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password, credential]);

  const loginDemo = (e) => {
    e.preventDefault();

    return dispatch(
      sessionActions.login({ credential: 'Demo-lition', password: 'password' })
    )
      .then(() => {
        closeModal();
        navigate('/');
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data?.errors) setErrors(data.errors);
      });
  };

  return (
    <div className="modal-container">
      <div className="header">Log In</div>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="label">Username</label>
        <input
          className="input"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder="Username or email"
        ></input>
        <label className="label">Password</label>
        <input
          className="input"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        ></input>
        {errors.credential && <p>{errors.credential}</p>}
        <button className="submit-button" type="submit" disabled={disabled}>
          Log In
        </button>
      </form>
      <button className="demo-button" onClick={loginDemo}>
        Log In as Demo User
      </button>
    </div>
  );
};

export default LoginFormModal;
