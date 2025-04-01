import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import "./assets/styles/App.css";
import "./assets/styles/Interview.css";
import "./assets/styles/resumeValidator.min.css";
import "./assets/styles/PageNotFound.css";

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
