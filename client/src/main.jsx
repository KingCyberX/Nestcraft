import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './Router';
import './index.css';
import { Provider } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";


import { store } from "./redux/store";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>
);