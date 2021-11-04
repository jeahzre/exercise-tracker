import CreateUser from './components/CreateUser';
import CreateExercise from './components/CreateExercise';
import './App.css'
import React, { Component } from 'react';
import ExercisesList from './components/ExercisesList';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userID: '',
            exerciseID: '',
            logs: [],
            isEditing: false,
            showFromInput: false,
            showToInput: false,
            showLimitInput: false,
            from: '',
            to: '',
            limit: '',
            // exercise list msg
            errorMsg: '',
            successMsg: ''
        }
        this.handleUserIDChange = this.handleUserIDChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditSubmit = this.handleEditSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleApplyFilterSubmit = this.handleApplyFilterSubmit.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    // create user
    handleUserIDChange(userID) {
        this.setState({
            userID
        })
        console.log(userID)
    }

    // on user id to get exercise change and submit
    handleChange(e) {
        console.log(this.state)
        // console.log(document.getElementById(e.target.id).closest('#exercise-list-table'));
            // , document.getElementById('filter').closest('#get-exercises-form'))
        if (e.target.id === 'exercises-list-id') {
            this.setState({
                userID: e.target.value
            })
        } else if (document.getElementById(e.target.id).closest('#exercise-list-table')) {
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
            else if (e.target.id === 'edit-date') {

                // console.log(new Date(e.target.value).toISOString())
                // console.log('date', e.target.value, this.state.date)
                // const prevDate = this.state.date;
                // const year = new Date(prevDate).getFullYear();
                // const month = new Date(prevDate).getMonth() + 1;
                // const date = new Date(prevDate).getDate();
                // console.log(prevDate, year, month, date);
                // const pad = (num, size) => {
                //     console.log('ymd', num)
                //     num = num.toString();
                //     while (num.length < size) num = "0" + num;
                //     return num;
                // }
                // const inputDate = e.target.value
                // const inputYear = Number(`${new Date(inputDate).getFullYear()}`);
                // const inputMonth = Number(`${new Date(inputDate).getMonth() + 1}`);
                // const anInputDate = Number(`${new Date(inputDate).getDate()}`);
                // console.log(inputDate, inputYear, inputMonth, anInputDate)
                // const YYYY_MM_DD = `${pad(`${year}${inputYear}`, 4)}-${pad(`${month}${inputMonth}`, 2)}-${pad(`${date}${anInputDate}`, 2)}`;
                // console.log('yyyy-mm-dd', YYYY_MM_DD)
                this.setState({
                    logs: [
                        ...this.state.logs.slice(0, listIndex),
                        {
                            ...this.state.logs[listIndex],
                            date: new Date(e.target.value).toDateString()
                        },
                        ...this.state.logs.slice(listIndex + 1)
                    ]
                })
                console.log('date', e.target.value)
            }
            
        }
        // else if (document.getElementById(e.target.id).closest('#filter')) {
        //     const selectValue = e.target.value;
        //     if (selectValue === 'from') {
                
        //     } else if (selectValue === 'to') {
                
        //     }
        //     // else if ( )
        // }
    }

    async handleSubmit(e) {
        e.preventDefault();
        console.log('handleSubmit');
        let fetchURL = `http://localhost:5000/api/users/${this.state.userID}/logs`;
        const { from, to, limit } = this.state;
        console.log('from, to, limit', from, to, limit);
        if (from || to || limit) {
            let sortedFilter = '';
            if (from || to || limit) {
                sortedFilter += '?'
            }
            if (from) {
                sortedFilter += `from=${from}`
            }
            if (to) {
                sortedFilter += `&to=${to}`
            }
            if (limit) {
                sortedFilter += `&limit=${limit}`
            }
            console.log(sortedFilter)
            fetchURL += sortedFilter;
            console.log(fetchURL)
        }
        await fetch(fetchURL, {
            method: 'GET'
        })
            .then(async res => {
                const data = await res.json();
                if (res.status === 400) {
                    this.setState({
                        errorMsg: data.msg,
                        successMsg: ''
                    })
                } else if (res.status === 200) {
                    this.setState({
                        errorMsg: '',
                        successMsg: data.msg
                    })
                }
                console.log('msg', data.msg)
                const dataPlusEditing = [...data.logs].map(data => {
                    return {
                        ...data,
                        isEditing: false,
                    }
                })
                console.log(dataPlusEditing);
                this.setState({
                    logs: dataPlusEditing,
                })
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorMsg: "Data isn't valid",
                    successMsg: ''
                });
            })
        // this.setState({
        //     _id: ''
        // })
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
            ],
            date: this.state.logs[listIndex].date,
            isEditing: true
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
            date: new Date(date).toISOString(),
            description, duration, _id
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
                ...this.state.logs.slice(listIndex + 1)
            ]
        });
        await fetch(`http://localhost:5000/api/users/${toBeDeletedID}/logs`, {
            method: 'DELETE'
        });
    }

    handleCheck(e) {
        const targetID = e.target.id;
        if (targetID === 'from') {
            this.setState({
                showFromInput: !this.state.showFromInput
            })
            if (this.state.from) {
                this.setState({
                    from: ''
                })
            }
            // const inputFrom = document.getElementById('change-from-date');
            // console.log(inputFrom.style.display)
            // if (window.getComputedStyle(inputFrom).display === 'none') {
            //     inputFrom.style.display = 'block';
            // } else if (inputFrom.style.display === 'block') {
            //     console.log('go none', inputFrom)
            //     inputFrom.style.display = 'none';
            //     console.log(inputFrom.style.display)
            // };
            // inputFrom.style.display = 'block'
        } else if (targetID === 'to') {
            this.setState({
                showToInput: !this.state.showToInput
            })
            if (this.state.to) {
                this.setState({
                    to: ''
                })
            }
        } else if (targetID === 'limit') {
            this.setState({
                showLimitInput: !this.state.showLimitInput
            })
            console.log(this.state.limit)
            if (this.state.limit) {
                this.setState({
                    limit: ''
                })
            }
        }
    }

    handleFilterChange(e) {
        const targetID = e.target.id;
        const targetValue = e.target.value
        if (targetID === 'change-from') {
            this.setState({
                from: targetValue
            })
        } else if (targetID === 'change-to') {
            this.setState({
                to: targetValue
            })
        } else if (targetID === 'change-limit') {
            this.setState({
                limit: targetValue
            })
        }
        console.log(targetValue)
    }

    async handleApplyFilterSubmit(filter) {
        console.log(filter);
        const { from, to, limit } = filter;
        console.log('from, to, limit', from, to, limit);
        let sortedFilter = '';
        if (from || to || limit) {
            sortedFilter += '?'
        }
        if (from) {
            sortedFilter += `from=${from}`
        }
        if (to) {
            sortedFilter += `&to=${to}`
        }
        if (limit) {
            sortedFilter += `&limit=${limit}`
        }
        console.log(sortedFilter)
        await fetch(`http://localhost:5000/api/users/${this.state.userID}/logs${sortedFilter}`, {
            method: 'GET'
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
    }

    render() {
        const propz = {
            handleChange: this.handleChange,
            handleSubmit: this.handleSubmit,
            handleEdit: this.handleEdit,
            handleEditSubmit: this.handleEditSubmit,
            handleDelete: this.handleDelete,
            handleCheck: this.handleCheck,
            handleApplyFilterSubmit: this.handleApplyFilterSubmit,
            handleFilterChange: this.handleFilterChange,
            exerciseID: this.state.exerciseID,
            userID: this.state.userID,
            logs: this.state.logs,
            showFromInput: this.state.showFromInput,
            showToInput: this.state.showToInput,
            showLimitInput: this.state.showLimitInput,
            from: this.state.from,
            to: this.state.to,
            limit: this.state.limit,
            errorMsg: this.state.errorMsg,
            successMsg: this.state.successMsg,
        }
        console.log(this.state)
        return (
            <>
                <h1 style={{ textAlign: "center" }}>Exercise Tracker</h1>
                <CreateUser handleUserIDChange={this.handleUserIDChange}/>
                <CreateExercise/>
                <ExercisesList {...propz}/>
            </>
        )
    }
}

export default App;