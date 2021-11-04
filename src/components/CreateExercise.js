// import axios from "axios";
import { Component } from "react";

// _id:
class CreateExercise extends Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            _id: '',
            description: '',
            duration: '',
            date: ''
        };
        this.handleCreateExerciseSubmit = this.handleCreateExerciseSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const inputName = e.target.name;
        const inputValue = e.target.value;
        if (inputName === '_id') {
            this.setState({
                _id: inputValue
            })
        } else if (inputName === 'description') {
            this.setState({
                description: inputValue
            })
        } else if (inputName === 'duration') {
            this.setState({
                duration: inputValue
            })
        } else if (inputName === 'date') {
            this.setState({
                date: inputValue
            })
        }
        console.log(this.state)
    }

    async handleCreateExerciseSubmit(e, log) {
        e.preventDefault();
        console.log(this.props.excersiseID)
        console.log(JSON.stringify(log), 'submitting')
        await fetch(`http://localhost:5000/api/users/${log._id}/exercises`, {
            method: 'POST',
            body: JSON.stringify(log),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            }
        })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    errorMsg: '',
                    successMsg: 'Log created.',
                })
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    errorMsg: 'Please fill the user ID, description and duration info.',
                    successMsg: '',
                })
            });
        this.setState({
            _id: '',
            description: '',
            duration: '',
            date: '',
        });
    }

    render() {
        // console.log(this.state)
        return (
            <>
                <form id="exercise-form" onSubmit={(e) => this.handleCreateExerciseSubmit(e, {
                    _id: this.state._id,
                    description: this.state.description, 
                    duration: this.state.duration, 
                    date: this.state.date
                })}>
                    <fieldset>
                    <legend id="form-title">Create New Exercise</legend>
                        <div id="alert" className={this.state.errorMsg ? "alert-error" : "alert-success"}>{this.state.errorMsg ? this.state.errorMsg : this.state.successMsg}</div>
                    <div id="form-inputs">
                        <div id="label-input">
                            <label htmlFor="_id">ID</label>
                            <input id="_id" onChange={this.handleChange} type="text" name="_id" placeholder="ID" value={this.state._id} />
                        </div>
                        <div id="label-input">
                            <label htmlFor="description">Description</label>
                            <input id="description" onChange={this.handleChange} type="text" name="description" placeholder="description" value={this.state.description} />
                        </div>
                        <div id="label-input">
                            <label htmlFor="duration">Duration</label>
                            <input id="duration" onChange={this.handleChange} type="text" name="duration" placeholder="duration" value={this.state.duration} />
                        </div>
                        <div id="label-input">
                            <label htmlFor="date">Date</label>
                            <input id="date"  onChange={this.handleChange} type="date" name="date" placeholder="date" value={this.state.date} />
                        </div>
                    </div >
                    <button id="exercise-submit-button" type="submit">Submit</button>
                    </fieldset>
                </form >
            </>
        )
    }
}

export default CreateExercise;