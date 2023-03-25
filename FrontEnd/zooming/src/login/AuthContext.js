import React, { createContext, useState } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const AuthContext = createContext();

export default AuthContext;

const client_id = "WiIRiYxPRYi0TXfYLETA"
const client_secret = "i0XquN5BjonaQT406qyCbNn6gz3LJ7RB"
const redirect_uri = "http://localhost:3000/"


export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(localStorage.getItem("authTokens"))
      : null
  );

  const [isLogged, setIsLogged] = useState(false);
  const history = useHistory();

  
  const GetCode = async () => {
    if(!isLogged){
      console.log('isLogged', isLogged)
      await window.open('http://127.0.0.1:8000/code', '_self')
      localStorage.setItem("logged_in",true)
      isLogged(true)
    }
    setIsLogged(false);
  };
  
  const Tokens = async () => {
    const cookieValue = Cookies.get('code')
    const authdata = btoa(`${client_id} + ':' + ${client_secret}`)
    const response = await fetch(`http://127.0.0.1:8000/tokens`, {
      method: "POST",
      headers : { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + authdata,
        'cache-control': 'no-cache',
        'X-MyCookie': cookieValue,
      },
    
      params : {
        "code": cookieValue,
        "grant_type": "authorization_code",
        "redirect_uri": redirect_uri,
      }

    });
    const data = await response.json();
    if (response.status === 200 && data) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access_token));
      localStorage.setItem("authTokens", JSON.stringify(data));
      return response;
    } else {
      alert("Something went wrong!");
    }
    console.log(">>>>>>>>>>>>>>>>>>>>",data);
  };

  const backendtoken = async () => {
    const token = localStorage.getItem("authTokens")
    const accessToken = JSON.parse(token);
    const access = accessToken.access_token
    const accessdata = localStorage.setItem('access', access)
    const Atoken = localStorage.getItem('access') 
    const response = await fetch(`http://127.0.0.1:8000/gettoken`, {
      method: "POST",
      headers : { 
        Authorization: `Bearer ${Atoken}`,
      },
      body: 'data',
    })
    .then(response => response.json(token))
    .then(data => console.log(data))
  }

  const registerUser = async (
    username,
    email,
    first_name,
    last_name,
    password,
    password2
  ) => {
    const response = await fetch("http://127.0.0.1:8000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        first_name,
        last_name,
        password,
        password2,
      }),
    });
    if (response.status === 201) {
      history.push("/SignIn");
    } else {
      alert("Data already exist");
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("logged_in");
    Cookies.remove('code')
    history.push("/");
  };

  const CreateMeeting = async (topic, start_time, duration, timezone) => {
    const token = localStorage.getItem("authTokens");
    const authtoken = JSON.parse(token);
    const response = await fetch("http://127.0.0.1:8000/createmeet", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authtoken.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        start_time,
        timezone,
        duration,
        
      }),
    });
    if (response.status === 200) {
      history.push("/MeetingDetail");
    } else {
      alert("Something went wrong!");
    }
  };

  const UpdateMeeting = async (topic, start_time, duration, timezone) => {
    const token = localStorage.getItem("authTokens");
    const authtoken = JSON.parse(token);
    const id = localStorage.getItem("data");
    const response = await fetch(`http://127.0.0.1:8000/updatemeet/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + authtoken.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic,
        start_time,
        timezone,
        duration,
      }),
    });
    if (response.status === 302) {
      history.push(`/ListMeeting`)
      return response.data;
    } else {
      alert("Something went wrong!");
    }
  };

  const DeleteMeeting = async () => {
    const token = localStorage.getItem("authTokens");
    const authtoken = JSON.parse(token);
    const id = localStorage.getItem("delete_id");
    const response = await fetch(`http://127.0.0.1:8000/updatemeet/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authtoken.access_token,
        "Content-Type": "application/json",
      }
    });
    if (response.status === 200) {
      history.push(`/ListMeeting`)
      return response.data;
    } else {
      alert("Something went wrong!");
    }
  };


  // const Code = async () => {
  //   const response = await fetch(`http://127.0.0.1:8000/getcode`, {
  //     method: "GET",
  //     headers: { 
  //       'Content-Type': 'application/json',
  //       'X-CSRFToken': Cookies.get('csrftoken'),
  //       'X-MyCookie': cookieValue,
  //     } 
  //     });
  //     if (response.status === 200) {
  //       return response.data;
  //     } else {
  //       alert("Something went wrong!");
  //     }
  // }


  const contextData = {
    user,
    setUser,
    authTokens,
    setAuthTokens,
    registerUser,
    logoutUser,
    CreateMeeting,
    UpdateMeeting,
    DeleteMeeting,
    GetCode,
    // Code,
    Tokens,
    backendtoken,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
