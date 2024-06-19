import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
    const [data, setData] = useState({ name: "", email: "", password: "", cpassword: "" })
    const navigate = useNavigate();
    const onChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const { name, password, email } = data;
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVjMjI2ZWZlNjQwZTNhYjc4NTRhZmE3In0sImlhdCI6MTcwNzIyNjUyMH0._mCLLBUQDJjowJgfeQsWeHNJYaH_KNSlKtOZp5ARAec"
            },
            body: JSON.stringify({ name, email, password })

        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem('token', json.authToken)
            props.showAlert("account created successfully", "success")
            navigate('/')
        }
        else {
            props.showAlert(json.error ? json.error : "Invalid credentials", "danger")
        }


    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" onChange={onChange} id="name" name='name' value={data.name} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" onChange={onChange} id="email" name='email' value={data.email} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="password" name='password' value={data.password} required minLength={5} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" onChange={onChange} id="cpassword" name='cpassword' value={data.cpassword} required minLength={5} />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup