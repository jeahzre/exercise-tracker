import axios from "axios";
import { Component } from "react";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseList: [
                {
                    _id: null,
                    username: null
                }
            ]
        }
        this.getExercise = this.getExercise.bind(this);
    }
    
    async getExercise()  {
        await axios.get('http://localhost:5000/api/users') 
        .then(res => {
            let dataz = [];
            res.data.map(datax =>
                dataz.push(datax));
            this.setState({
                exerciseList : dataz
            })
        })
    }

    componentDidMount() {
        this.getExercise();
    }
    render() {
        console.log(this.state.exerciseList.length)
        return (
            <>
                <table id="exercise-table">
                {
                this.state.exerciseList.map(data => {
                    { console.log('hi', data.username) }
                    return (
                        <>
                            <tr>
                                <td>
                                    {data.username}
                                </td>
                            </tr>
                        </>)
                })
                }
                </table>
            </>
        )
    } 
}

export default List;