// import axios from "axios";
import { Component } from "react";

class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            successMsg: '',
            errorMsg: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleCreateUserSubmit = this.handleCreateUserSubmit.bind(this);
    }

    handleChange(e) {
        console.log(e.target.value)
        console.log(this.state.username)
        this.setState({
            username: e.target.value
        })
    }

    async handleCreateUserSubmit(e, username) {
        e.preventDefault();
        await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            body: JSON.stringify(username),
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(async res => {
                const data = await res.json()
                const { msg } = data;
                console.log(msg, res);
                if (res.status === 400) {
                    this.setState({
                        errorMsg: msg,
                        successMsg: ''
                    })
                } else if (res.status === 200) {
                    this.setState({
                        errorMsg: '',
                        successMsg: msg
                    })
                }
        })
            .catch(async (error) => {
                console.log('error', error)
                // this.setState({
                // errorMsg: error.msg
            // })
        })
        this.setState({
            username: ''
        })
    }

    render() {
        console.log(this.state)
        return (
            <>
                <form id="user-form" onSubmit={(e) => this.handleCreateUserSubmit(e, this.state)}>
                    <fieldset>
                    <legend id="form-title">Create New User</legend>
                    <div id="alert" className={this.state.errorMsg? "alert-error" : "alert-success"}>{this.state.errorMsg ? this.state.errorMsg : this.state.successMsg }</div>
                    <div id="label-input">
                            <label htmlFor="user">User</label>
                            <div id="create-user-engine">
                            <input id="user" onChange={this.handleChange} type="text" name="user" placeholder="username" value={this.state.username} />
                            <button type="submit">Get</button>
                            </div>
                    </div>
                    </fieldset>
                </form>
            </>
        )
    }
}

export default CreateUser;