import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar';
import RegistrationForm from './registrationForm';
import NotesDetail from './Notesdetail';
import AddNotes from './AddNotes';
import DeleteNotes from './deleteNotes';
import ShowNotes from './showNotes';
import Login from './Login';
import Logout from './Logout';
import auth from '../Services/authService';



class MainComponent extends Component {
    render() {
        const user = auth.getUser();
        console.log(user);
        return (
            <div className='container'>
                <Navbar user={user} />
                <Switch>
                    <Route path='/users/:id/notes' render={(props) => (
                        user ? <AddNotes user={user} {...props} /> : <Redirect to="/login" />
                    )} />
                    <Route path='/users' render={(props) => (
                        user ? <NotesDetail user={user} {...props} /> : <Redirect to="/login" />
                    )} />
                    <Route path='/editNotes/:id/notes/:noteId' render={(props) => (
                        user ? <AddNotes {...props} /> : <Redirect to="/login" />
                    )} />
                    <Route path='/showNotes/:id/notes/:noteId' render={(props) => (
                        user ? <ShowNotes {...props} /> : <Redirect to="/login" />
                    )} />
                    <Route path='/deleteNotes/:id/notes/:noteId' render={(props) => (
                        user ? <DeleteNotes {...props} /> : <Redirect to="/login" />
                    )} />
                    <Route path='/createUser' component={RegistrationForm} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Redirect exact from='/' to="/" />
                </Switch>
            </div>
        );
    }
}

export default MainComponent;
