
import React, { Component } from "react";
import http from "../Services/httpService";
import auth from '../Services/authService';

class RegistrationForm extends Component {
    state = {
        form: { password: "", name: '', repassword: '', email: "" },
        isAdding: false,
        successMessage: "",
        errors: {},
    };

    handleChange = (e) => {
        const { currentTarget: input } = e;
        let updatedForm = { ...this.state.form };
        updatedForm[input.name] = input.value;
        this.setState({ form: updatedForm });
    };

    validateForm = () => {
        const { password, name, repassword, email } = this.state.form;
        const errors = {};

        if (!name || name.length < 4) {
            errors.name = "Username should be at least 4 characters";
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email should be in the format example@mail.com";
        }


        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}$/;
        if (!password || !password.match(passwordRegex)) {
            errors.password = "Password should be min. 7 characters with a lowercase, uppercase, and digit";
        }

        if (password !== repassword) {
            errors.repassword = "Passwords do not match";
        }

        return errors;
    }

    async postData(url, obj) {
        try {
            let response = await http.postReq(url, obj);
            let { data } = response;
            console.log(data);
            this.setState({ successMessage: "Users successfully added.", errors: {}, isAdding: false });
            this.setState({ form: { password: "", name: '', repassword: '', email: '' } });
        }
        catch (ex) {
            console.log(ex)
            if (ex.response && ex.response.status === 400) {
                let errors = {}
                errors.email = ex.response.data.error;
                this.setState({ errors: errors, successMessage: "", isAdding: false });
            }
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        const errors = this.validateForm();
        if (Object.keys(errors).length === 0) {
            const { form } = this.state;
            this.setState({ isAdding: true });

            try {
                await this.postData("/register", form);
            } catch (ex) {
                console.log(ex);
            }
            window.location.href = "/login";
        } else {
            this.setState({ errors: errors, successMessage: "", isAdding: false });
        }
    }

    render() {
        const { password, name, repassword, email } = this.state.form;
        const { errors, successMessage, isAdding } = this.state;

        return (
            <div className="container ">
                <h4>New User</h4>
                {successMessage && (
                    <span className='text-success'>{successMessage}</span>
                )}
                <div className="form-group">
                    <label >Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={this.handleChange}
                    />
                    {errors.name && (
                        <span className='text-danger'>{errors.name}</span>
                    )}
                    <div className="form-group">
                        <label >Email:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={this.handleChange}
                        />
                        {errors.email && (
                            <span className='text-danger'>{errors.email}</span>
                        )}
                    </div>




                    <div className="form-group">

                        <label >Password:</label>

                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            placeholder="Enter Password 'Password should be min. 7 characters with a lowercase, uppercase, and digit'"
                            value={password}
                            onChange={this.handleChange}
                        />
                        {errors.password && (
                            <span className='text-danger'>{errors.password}</span>
                        )}

                        <div className="form-group">

                            <label >Confirm Password:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="repassword"
                                name="repassword"
                                placeholder="Re-Enter Password"
                                value={repassword}
                                onChange={this.handleChange}
                            />
                            {errors.repassword && (
                                <span className='text-danger'>{errors.repassword}</span>
                            )}

                        </div>
                    </div>
                    <div>
                        <button className='btn btn-primary m-2' onClick={this.handleSubmit} disabled={isAdding}>
                            Create
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default RegistrationForm;
