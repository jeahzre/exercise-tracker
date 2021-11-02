import CreateUser from './components/CreateUser';
import CreateExercise from './components/CreateExercise';
import './App.css'
import React, { Component } from 'react';
import ExercisesList from './components/ExercisesList';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: ''
        }
        this.handle_idChange = this.handle_idChange.bind(this);
    }

    handle_idChange(_id) {
        this.setState({
            _id
        })
        console.log(_id)
    }

    render() {
        return (
            <>
                <h1 style={{ textAlign: "center" }}>Exercise Tracker</h1>
                <CreateUser handle_idChange={this.handle_idChange}/>
                <CreateExercise />
                <ExercisesList handle_idChange={ this.handle_idChange}/>
            </>
        )
    }
}

export default App;