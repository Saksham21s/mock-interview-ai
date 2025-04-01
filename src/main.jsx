import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import './styles/App.min.css';
import './styles/Interview.css';
import './styles/resumeValidator.min.css';
import './styles/PageNotFound.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
