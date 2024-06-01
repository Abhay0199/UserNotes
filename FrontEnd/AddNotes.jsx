import React, { Component } from 'react';
import http from "../Services/httpService";
import auth from '../Services/authService';

export default class AddNotes extends Component {
    state = {
        form: { title: "", description: "" },
        isAdding: false,
        successMessage: "",
        errors: {},
        noteId: null // to store the ID of the note being edited
    };

    async componentDidMount() {
        // Check if there's a note ID passed via props for editing
        const { noteId } = this.props.match.params;

        if (noteId) {
            try {
                const response = await http.get(`/users/${auth.getUser().id}/notes/${noteId}`);
                const { data } = response;
                console.log(data)
                this.setState({ form: data, noteId });
            } catch (ex) {
                console.error("Error fetching note:", ex);
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            form: { ...prevState.form, [name]: value },
        }));
    };

    validateForm = () => {
        const { title, description } = this.state.form;
        const errors = {};

        if (!title) errors.title = "Enter a Title";
        if (!description) errors.description = "Enter the Description";

        return errors;
    };

    async postData(url, obj) {
        try {
            const response = await http.post(url, obj);
            const { data } = response;
            this.setState({
                successMessage: "Note successfully added.",
                errors: {},
                isAdding: false,
                form: { title: "", description: "" }
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.status === 400) {
                const errors = {};
                errors.general = ex.response.data.error;
                this.setState({ errors, successMessage: "", isAdding: false });
            }
        }
    }

    async putData(url, obj) {
        try {
            const response = await http.put(url, obj);
            const { data } = response;
            this.setState({
                successMessage: "Note successfully updated.",
                errors: {},
                isAdding: false,
                form: { title: "", description: "" }
            });
        } catch (ex) {
            console.log(ex);
            if (ex.response && ex.response.status === 400) {
                const errors = {};
                errors.general = ex.response.data.error;
                this.setState({ errors, successMessage: "", isAdding: false });
            }
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { noteId, form } = this.state;
        const { title, description } = form;
        const errors = this.validateForm();

        if (Object.keys(errors).length === 0) {
            this.setState({ isAdding: true });
            const userId = auth.getUser().id;
            const url = noteId ? `/users/${userId}/notes/${noteId}` : `/users/${userId}/notes`;
            try {
                if (noteId) {
                    await this.putData(url, { title, description });
                } else {
                    await this.postData(url, { title, description });
                }
                this.props.history.push('/users');
            } catch (ex) {
                console.error("Error submitting note:", ex);
            }
        } else {
            this.setState({ errors, successMessage: "", isAdding: false });
        }
    };

    render() {
        const { title, description } = this.state.form;
        const { errors, successMessage, isAdding } = this.state;

        return (
            <div className="container">
                <h4>{this.state.noteId ? 'Edit Note' : 'Add Note'}</h4>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label>Title<span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                            id="title"
                            name="title"
                            placeholder="Enter Title"
                            value={title}
                            onChange={this.handleChange}
                        />
                        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                    </div>
                    <div className="form-group">
                        <label>Description<span className="text-danger">*</span></label>
                        <textarea
                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                            id="description"
                            name="description"
                            placeholder="Enter Description"
                            value={description}
                            onChange={this.handleChange}
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>
                    {errors.general && <div className="alert alert-danger">{errors.general}</div>}
                    <button type="submit" className="btn btn-primary m-2" disabled={isAdding}>
                        {isAdding ? 'Adding...' : 'Add Notes'}
                    </button>
                </form>
            </div>
        );
    }
}
