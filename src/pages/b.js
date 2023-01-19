import React from "react";
import {Route, Link, Routes, useLocation, useNavigate} from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Welcome b</h1>
      <h2>I am react app with react link</h2>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/a">About</Link>
          </li>
          <li>
            <Link to="/b">Users</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
