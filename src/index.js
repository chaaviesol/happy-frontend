import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Contexts from "./Contexts/Contexts";
import AuthProvider from "./Contexts/Auth/AuthProvider";
import SelectedTypeContext from "./Contexts/SelectedTypeContext";
import { stores } from "./Redux/stores";
import { Provider } from "react-redux";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SelectedTypeContext>
        <Contexts>
          <Provider store={stores}>
            <App />
          </Provider>
        </Contexts>
      </SelectedTypeContext>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
