import React, { Component } from "react";
import http from "../Services/httpService.js";


class NotesDetail extends Component {
    state = {
        users: null,
    };

    async fetchData() {
        const { user } = this.props;
        const id = user.id
        console.log(id)
        try {
            let response = await http.get(`/user/${id}`);
            console.log(response);
            let { data, status } = response;
            console.log(data);
            if (status === 200) {
                this.setState({ users: data });

            } else {
                console.error("Invalid data received:", data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.location.search !== this.props.location.search) {
            this.fetchData();
        }
    }
    AddNotes = (id) => {
        this.props.history.push(`/users/${id}/notes`);
    };
    EditNotes = (id, noteId) => {
        this.props.history.push(`/editNotes/${id}/notes/${noteId}`);
    };
    DeleteNotes = (id, noteId) => {
        this.props.history.push(`/deleteNotes/${id}/notes/${noteId}`);
    };
    ShowNotes = (id, noteId) => {
        this.props.history.push(`/showNotes/${id}/notes/${noteId}`);
    };

    render() {
        const { users } = this.state;
        console.log(users);
        const { user } = this.props;
        const id = user.id
        return (
            <div className="container">
                <h4>All Notes</h4>
                <div className="row mb-2">
                    <div className="col-2 text-center border bg-primary text-white">Notes Title</div>
                    <div className="col-10 text-center border bg-primary text-white">Notes Description</div>
                </div>
                {users && users.notes
                    .slice()
                    .reverse()
                    .map((note, index) => (
                        <div className="row mb-2" key={index}>
                            <div className="col-2 text-center border" onClick={() => this.ShowNotes(id, note._id)}>{note.title}</div>
                            <div className="col-8 text-center border">{note.description}</div>
                            <div className="col-1 text-center border">   <button className="btn btn-warning my-2" onClick={() => this.EditNotes(id, note._id)}>Edit </button></div>
                            <div className="col-1 text-center border">   <button className="btn btn-danger my-2" onClick={() => this.DeleteNotes(id, note._id)}>Delete </button></div>
                        </div>

                    ))}
                <button className="btn btn-primary mx-2" onClick={() => this.AddNotes(id)}>Add Notes </button>
            </div>
        );
    }
}

export default NotesDetail;
