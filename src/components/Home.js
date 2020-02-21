import React, { useReducer } from "react";
import Fileseat from "./Fileseat";
import Login from "./Login";
import { Switch, Route } from "react-router-dom";
import "../assets/css/Home.css";
import { Signup } from "./Signup";
import { AdminDashboard, UserDashboard } from "./Dashboard";
import { NotFound } from "./NotFound";
import { PrivateRoute } from "./Private.route";
export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      localStorage.setItem('token', JSON.stringify(action.payload.token))
      return {
        ...state, isAuthenticated: true, user: action.payload.user, token: action.payload.token
      }
    case 'LOGOUT':
      localStorage.clear();
      return {
        ...state, isAuthenticated: false, user: null
      }
    default:
      return state
  }
}

const Home = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <AuthContext.Provider value={{ state, dispatch }}>
        <div className="h-full">
          <Switch>
            <Route exact path="/" component={Fileseat} />
            <Route exact path="/auth" component={Login} />
            <Route exact path="/newauth" component={Signup} />
            <PrivateRoute exact path="/user" component={UserDashboard} />
            <PrivateRoute exact path="/admin" component={AdminDashboard} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </AuthContext.Provider>
    </>
  );
};

export default Home;
