// import axios from "axios";
import { Component } from "react";

class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log(e.target.value)
        console.log(this.state.username)
        this.setState({
            username: e.target.value
        })
    }

    async handleSubmit(e) {
        e.preventDefault();
        await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(async res => console.log(await res.json()))
    }

    render() {
        return (
            <>
                <form id="user-form" onSubmit={ this.handleSubmit}>
                    <div id="form-title">Create New User </div>
                    <div id="label-input">
                        <label htmlFor="user">User</label>
                        <input id="user" onChange={this.handleChange} type="text" name="user" placeholder="username" value={this.state.username }/>
                    </div>
                </form>
            </>
        )
    }
}

export default CreateUser;