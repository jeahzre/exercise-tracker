import { Component } from "react";

class ExercisesList extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        // }
        this.toggleFilters = this.toggleFilters.bind(this);
    }

    // filter
    toggleFilters() {
        const filterBox = document.getElementById('filter-box');
        console.log(filterBox.clientHeight)
        filterBox.style.height = filterBox.clientHeight === 0 ? 'auto' : '0px';
    }


    render() {
        // console.log(this.state)
        const { userID, logs, handleChange, handleSubmit, handleEdit, handleEditSubmit, handleDelete, handleCheck, handleApplyFilterSubmit, handleFilterChange, showFromInput, showToInput, showLimitInput, from, to, limit, errorMsg, successMsg } = this.props;
        console.log('msg', successMsg, errorMsg)
        return (
            <>
                <form id="get-exercises-form" onSubmit={handleSubmit} className="clearfix">
                    <fieldset>
                    <legend id="form-title">Get Your Exercise Logs</legend>
                        <div id="alert" className={errorMsg ? "alert-error" : "alert-success"}>{errorMsg ? errorMsg : successMsg}</div>
                    {/* button type is not submit */}
                    <button type="button" id="filter-btn" onClick={this.toggleFilters}>Filter{(from||to||limit)? '  v' : ''}</button>
                    <div id="filter-box">
                        <div id="filters" className="clearfix">
                            <div id="label-input">
                                <div id="checkbox-label">
                            <input type="checkbox" id="from" onClick={handleCheck}/>
                            <label htmlFor="from">From</label>
                                </div>
                                <input type="date" id="change-from" className="change-filter" name="from" style={{ display: showFromInput ? 'block' : 'none' }} onChange={handleFilterChange} value={from}/>
                            </div>
                            <div id="label-input">
                                <div id="checkbox-label">
                            <input type="checkbox" id="to" onClick={handleCheck}/>
                            <label htmlFor="to">To</label>
                                </div>
                                <input type="date" id="change-to" className="change-filter" style={{ display: showToInput ? 'block' : 'none' }} onChange={handleFilterChange} value={to}/>
                            </div>
                            <div id="label-input">
                                <div id="checkbox-label">
                            <input type="checkbox" id="limit" onClick={handleCheck}/>
                            <label htmlFor="limit">Limit</label>
                                </div>
                                <input type="number" placeholder="limit" id="change-limit" className="change-filter" style={{ display: showLimitInput ? 'block' : 'none' }} onChange={handleFilterChange} value={limit}/>
                            </div>
                            <button type="button" id="apply-filter-btn" onClick={() => handleApplyFilterSubmit({
                                from, to, limit
                            })}>Apply</button>
                        </div>
                        
                    </div>

                    <div id="form-inputs">
                        <div id="label-input">
                            <label htmlFor="exercises-list-id">User ID</label>
                            <div id="get-engine">
                            <input id="exercises-list-id" value={userID} onChange={handleChange} type="text" name="_id" placeholder="ID" />
                            <button type="submit">Get</button>
                            </div>
                        </div>
                    </div>
                    </fieldset>
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
                            logs.map((log) => {
                                const { _id, description, duration, date } = log;
                                let year, month, aDate;
                                    console.log('isnt editing')
                                    // pad leading zero
                                    const pad = (num, size) => {
                                        num = num.toString();
                                        while (num.length < size) num = "0" + num;
                                        return num;
                                    }
                                    year = pad(`${new Date(date).getFullYear()}`, 4);
                                    month = pad(`${new Date(date).getMonth() + 1}`, 2);
                                    aDate = pad(`${new Date(date).getDate()}`, 2);
                                const YYYY_MM_DD = `${year}-${month}-${aDate}`;
                                const listIndex = logs.indexOf(log);
                                const onEditingRow = logs[listIndex].isEditing;
                                console.log('2', date)
                                return (
                                    <>
                                        <tr id={_id} key={`${_id}1`}>
                                            <td key={`${_id}2`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-description" type="text" value={description} onChange={handleChange} key={`${_id}3`} /> :
                                                        description
                                                }
                                            </td>
                                            <td key={`${_id}4`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-duration" type="number" value={duration} onChange={handleChange} key={`${_id}5`} /> :
                                                        duration
                                                }
                                            </td>
                                            <td key={`${_id}6`}>
                                                {
                                                    onEditingRow ?
                                                        <input id="edit-date" type="date" value={YYYY_MM_DD} onChange={handleChange} key={`${_id}7`} onKeyPress={() => {return false}}/> :
                                                        date.toString()
                                                }
                                            </td>
                                            <td id="action" key={`${_id}8`}>
                                                {console.log('onEditingRow', onEditingRow)}
                                                <button onClick={onEditingRow ? handleEditSubmit : handleEdit} id="action" key={`${_id}9`}>
                                                    {
                                                        onEditingRow ?
                                                            "Done" : "Edit"
                                                    }
                                                </button>
                                            </td>
                                            <td id="action" key={`${_id}10`}>
                                                <button onClick={handleDelete} id="action" key={`${_id}11`}>
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