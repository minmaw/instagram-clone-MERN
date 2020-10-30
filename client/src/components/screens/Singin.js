import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css'

export default function Signin() {
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const history = useHistory()

  const postData = () =>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      return M.toast({html: "Invalid Email", classes: "#ff5252 red accent-2"})
    }
    fetch("/signin", {
      method: "post",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    }).then(res=>res.json())
    .then(data=>{
      console.log(data);
      if(data.error){
        M.toast({html: data.error, classes: "#ff5252 red accent-2"})
      }else{
        M.toast({html: `Welcome ${data.user.name}`, classes: "#388e3c green darken-2"})
        history.push('/')
      }
    }).catch(err=>{
      console.log(err);
    })
  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input type="text" placeholder="email" 
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <input type="text" placeholder="password" 
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />
        <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={()=>postData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
}