import React, { Component } from 'react'
import { Link } from 'react-router-dom';
export default class Navbar extends Component {
    render() {
        const { user } = this.props;
        return (

            <div>
                <nav className="navbar navbar-expand-sm navbar-warning bg-warning ">
                    <Link to="/Users" className="navbar-brand">
                        Home
                    </Link>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav mr-auto">

                        </ul>

                    </div>
                    <div className="ml-100">
                        <ul className="navbar-nav">
                            {!user && (
                                <li className='nav-item'>
                                    <Link className="nav-link" to="/login">
                                        Login
                                    </Link>
                                </li>
                            )}
                            {user && (
                                <li className='nav-item'>
                                    <span className="nav-link">
                                        Welcome {user.name}
                                    </span>
                                </li>
                            )}
                            {user && (
                                <li className='nav-item'>
                                    <Link className="nav-link" to="/logout">
                                        Logout
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}
