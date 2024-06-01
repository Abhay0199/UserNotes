
import React, { Component } from 'react'
import http from '../Services/httpService.js'

export class DeleteNotes extends Component {
    async componentDidMount() {
        let { id } = this.props.match.params;
        let { noteId } = this.props.match.params;
        let response = await http.deleteReq(`/users/${id}/notes/${noteId}`);
        window.location.href = "/users";
        // this.props.history.push("/users")
    }

    render() {
        return "";
    }
}

export default DeleteNotes
