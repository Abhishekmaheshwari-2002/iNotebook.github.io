import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

const Signup = (props) => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" })
    let navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call 
        const { name, email, password } = credentials;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        if (json.success) {
            //save the auth token and redirect 
            localStorage.setItem("token", json.authtoken);
            navigate("/");
            props.showAlert("Successfully created", "success");

        }
        else {
            props.showAlert("invalid credentials", "danger");
        };
    }
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="name" onChange={onChange} minLength={5} required aria-describedby="emailHelp" name="name" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={onChange} minLength={5} required aria-describedby="emailHelp" name="email" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={onChange} minLength={5} required className="form-control" id="password" name="password" />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="cpassword" onChange={onChange} minLength={5} required className="form-control" id="cpassword" name="cpassword" />
                </div>
                <button type="submit" onSubmit={handleSubmit} className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup
