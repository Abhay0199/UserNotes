import React, { Component } from 'react';
import http from "../Services/httpService";
import auth from '../Services/authService';

export default class ShowNotes extends Component {
    state = {
        note: null,
    };

    async componentDidMount() {
        const { noteId } = this.props.match.params;

        try {
            const response = await http.get(`/users/${auth.getUser().id}/notes/${noteId}`);
            const { data } = response;
            console.log(data);
            this.setState({ note: data });
        } catch (ex) {
            console.error("Error fetching note:", ex);
        }
    }

    render() {
        const { note } = this.state;

        return (
            <div className="container">
                <h4>Note Details</h4>
                <div className="row mb-2">
                    <div className="col-2 text-center border bg-primary text-white">Note Title</div>
                    <div className="col-10 text-center border bg-primary text-white">Note Description</div>
                </div>

                {note && (
                    <div className="row mb-2">
                        <div className="col-2 text-center border">{note.title}</div>
                        <div className="col-8 text-center border">{note.description}</div>
                    </div>
                )}

                {!note && <div>No note found.</div>}
            </div>
        );
    }
}
