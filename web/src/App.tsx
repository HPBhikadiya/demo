import axios from "axios";
import { get } from "lodash";
import { Fragment } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import Login from "./pages/Login";
import ToDo from "./pages/ToDo";

function App() {
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          ></Route>
          <Route
            path="/"
            element={
              <>
                <AuthenticatedRoute />
              </>
            }
          >
            <Route path="/" element={<ToDo />}></Route>
          </Route>
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
