import React, { useState } from 'react';
import axios from 'axios';

const SignUp = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        username,
        password,
      });

      console.log(response.data);
      setToken(response.data.token);
    } catch (error) {
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <div>
        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleSignUp}>Sign Up</button>
    </div>
  );
};

export default SignUp;
