import axios from "axios";
import { Component } from "react";

class CreateExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            description: '',
            duration: '',
            date: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        const inputName = e.target.name
        const inputValue = e.target.value
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

    async handleSubmit(e) {
        e.preventDefault();
        console.log(JSON.stringify({
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }), 'submitting')
        await fetch(`http://localhost:5000/api/users/${this.state._id}/exercises`, {
            method: 'POST',
            body: JSON.stringify({
                description: this.state.description,
                duration: this.state.duration,
                date: this.state.date
            }),
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            }
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));
    }

    render() {
        return (
            <>
                <form id="exercise-form" onSubmit={this.handleSubmit}>
                    <div id="form-title">Create New Exercise</div>
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
                </form >
            </>
        )
    }
}

export default CreateExercise;