import { Component } from "react";

class ExercisesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            logs: [],
            exerciseID: '',
        }
        // this.handle_idChange = this.props.handle_idChange.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleEditSubmit = this.handleEditSubmit.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }

    handleChange(e) {
        console.log(e.target.value)
        if (e.target.id === 'exercises-list-id') {
            this.setState({
                _id: e.target.value
            })
        } else {
            const listIndex = Array.from(e.target.parentElement.parentElement.parentElement.children).indexOf(e.target.parentElement.parentElement);
            if (e.target.id === 'edit-description') {
                this.setState({
                    logs: [
                        ...this.state.logs.slice(0, listIndex),
                        {
                            ...this.state.logs[listIndex],
                            description: e.target.value
                        },
                        ...this.state.logs.slice(listIndex + 1)
                    ]
                })
            } else if (e.target.id === 'edit-duration') {
                this.setState({
                    logs: [
                        ...this.state.logs.slice(0, listIndex),
                        {
                            ...this.state.logs[listIndex],
                            duration: Number(e.target.value)
                        },
                        ...this.state.logs.slice(listIndex + 1)
                    ]
                })
            }
            e.target.focus()
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log(this.state._id)
        await fetch(`http://localhost:5000/api/users/${this.state._id}/logs`, {
            method: 'GET'
            // headers: {
            //     'Content-type': 'application/json'
            // }
        })
            .then(async res => {
                const data = await res.json();
                const dataPlusEditing = [...data.logs].map(data => {
                    return {
                        ...data,
                        isEditing: false
                    }
                })
                console.log(dataPlusEditing);
                this.setState({
                    logs: dataPlusEditing
                })
            })
            .catch(error => console.log(error))
        this.setState({
            _id: ''
        })
    }

    async handleEdit(e) {
        console.log('handleEdit');
        console.log(e.target.parentElement.parentElement.id);
        const listIndex = Array.from(e.target.parentElement.parentElement.parentElement.children).indexOf(e.target.parentElement.parentElement);
        this.setState({
            exerciseID: e.target.parentElement.parentElement.id,
            logs: [
                ...this.state.logs.slice(0, listIndex),
                {
                    ...this.state.logs[listIndex],
                    isEditing: true
                },
                ...this.state.logs.slice(listIndex + 1)
            ]
        });
        // const listIndex = Array.from(e.target.parentElement.parentElement.parentElement.children).indexOf(e.target.parentElement.parentElement);
    }

    async handleEditSubmit(e) {
        console.log('handleEditSubmit');
        const listIndex = Array.from(e.target.parentElement.parentElement.parentElement.children).indexOf(e.target.parentElement.parentElement);
        this.setState({
            exerciseID: '',
            logs: [
                ...this.state.logs.slice(0, listIndex),
                {
                    ...this.state.logs[listIndex],
                    isEditing: false
                },
                ...this.state.logs.slice(listIndex + 1)
            ]
        });
        const toBeUpdatedLog = this.state.logs.filter(log => log._id === this.state.exerciseID);
        console.log(toBeUpdatedLog);
        const { date, description, duration, _id } = toBeUpdatedLog[0];
        const toBeUpdatedLogMinusEditing = {
            date, description, duration, _id
        }
        await fetch(`http://localhost:5000/api/users/${this.state.exerciseID}/logs`, {
            method: 'PATCH',
            body: JSON.stringify(toBeUpdatedLogMinusEditing),
            headers: {
                'Content-type': 'application/json'
            }
        });
    }

    async handleDelete(e) {
        console.log('handleDelete')
        const listIndex = Array.from(e.target.parentElement.parentElement.parentElement.children).indexOf(e.target.parentElement.parentElement);
        const toBeDeletedID = e.target.parentElement.parentElement.id;
        console.log(toBeDeletedID);
        // make sure exerciseID and logs set to default(exercise: empty, logs[listIndex].isEditing: false)
        this.setState({
            exerciseID: '',
            logs: [
                ...this.state.logs.slice(0, listIndex),
                {
                    ...this.state.logs[listIndex],
                    isEditing: false
                },
                ...this.state.logs.slice(listIndex + 1)
            ]
        });
        await fetch(`http://localhost:5000/api/users/${toBeDeletedID}/logs`, {
            method: 'DELETE'
        });
    }

    render() {
        console.log(this.state)
        return (
            <>
                <form id="get-exercises-form" onSubmit={this.handleSubmit}>
                    <div id="form-title">Get Your Exercise Logs</div>
                    <div id="form-inputs">
                        <div id="label-input">
                            <label htmlFor="exercises-list-id">User ID</label>
                            <input id="exercises-list-id" value={this.state._id} onChange={this.handleChange} type="text" name="_id" placeholder="ID" />
                        </div>
                    </div>
                </form>

                <table id="exercise-list-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th id="action">Edit</th>
                            <th id="action">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.logs.map((log) => {
                                const { _id, description, duration, date } = log;
                                const year = new Date(date).getFullYear();
                                const month = new Date(date).getMonth() + 1;
                                let aDate = `${new Date(date).getDate()}`;
                                aDate = Number(aDate) < 10 ? `0${aDate}` : `${aDate}`;
                                const YYYY_MM_DD = `${year}-${month}-${aDate}`;
                                const listIndex = this.state.logs.indexOf(log);
                                const onEditingRow = this.state.logs[listIndex].isEditing;
                                return (
                                    <>
                                        <tr id={_id} key={`${_id}1`}>
                                            <td key={`${_id}2`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-description" type="text" value={description} onChange={this.handleChange} key={`${_id}3`} /> :
                                                        description
                                                }
                                            </td>
                                            <td key={`${_id}4`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-duration" type="number" value={duration} onChange={this.handleChange} key={`${_id}5`} /> :
                                                        duration
                                                }
                                            </td>
                                            <td key={`${_id}6`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-date" type="date" value={YYYY_MM_DD} onChange={this.handleChange} key={`${_id}7`} /> :
                                                        date.toString()
                                                }
                                            </td>
                                            <td id="action" key={`${_id}8`}>
                                                {console.log('onEditingRow', onEditingRow)}
                                                <button onClick={onEditingRow ? this.handleEditSubmit : this.handleEdit} id="action" key={`${_id}9`}>
                                                    {
                                                        onEditingRow ?
                                                            "Done" : "Edit"
                                                    }
                                                </button>
                                            </td>
                                            <td id="action" key={`${_id}10`}>
                                                <button onClick={this.handleDelete} id="action" key={`${_id}11`}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                )
                            })
                        }
                    </tbody>
                </table>
            </>
        )
    }
}

export default ExercisesList;