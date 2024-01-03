import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import TodoList from './TodoList';

function App() {
  const [token, setToken] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" render={() => <SignUp setToken={setToken} />} />
        <Route path="/login" render={() => <Login setToken={setToken} />} />
        <Route path="/todo" render={() => <TodoList token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;