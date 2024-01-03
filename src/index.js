import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { render } from 'react-dom';

const domnode = document.getElementById('root');
render(<App/>, domnode);

reportWebVitals();
