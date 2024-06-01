import React, { Component } from "react";
import http from "../Services/httpService";
import auth from '../Services/authService';
import { Link } from "react-router-dom";

class Login extends Component {
    state = {
        form: { email: "", password: "" },
        errors: {}
    };

    handleChange = (e) => {
        const { currentTarget: input } = e;
        let form = { ...this.state.form };
        form[input.name] = input.value;
        this.setState({ form });
    }

    async login(url, obj) {
        try {
            let response = await http.post(url, obj);
            let { data } = response;
            auth.login(data);
            window.location.href = "/users";
            // this.props.history.push("/users"); 
        } catch (ex) {
            if (ex.response && ex.response.status === 400) {
                const errors = { ...this.state.errors };
                errors.email = "Invalid email or password";
                this.setState({ errors });
            } else {
                console.error(ex);
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.login("/login", this.state.form);
    };

    render() {
        let { email, password } = this.state.form;
        let { errors } = this.state;
        return (
            <div className="container text-center m-4">
                <h2>Welcome</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="row mt-2">
                        <div className="col-12">
                            {errors.email && (
                                <span className='text-danger'>{errors.email}</span>
                            )}<br />
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Email id:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={this.handleChange}
                            />
                            <small>We'll never share your email and Password with anyone else.</small>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-12">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }}>Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                placeholder="Enter Password"
                                value={password}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary">Login</button>
                    </div>

                </form>
                <div className="container text-center my-4">
                    <Link to="/createUser">Create New user</Link>
                    <br />
                    <small>If you're not a user, click "Create New user"</small>
                </div>
            </div>
        );
    }
}

export default Login;
