import React from 'react';
import '../../functions/functions';
import functions from '../../functions/functions';
import './TimeSelection.css';

const TimeSelection = (props) => {
    let theTimes = [];
    if (props.availableTimes) {
        theTimes = functions.calculateAvailableTimes(props.availableTimes, props.startTime, props.endTime).reverse()
    }
    return (
        <div className="times-container">
            <h3>You have selected {props.date.toDateString()}</h3>

            {
                //map out available times here
                theTimes.map((time, i) => {
                    return <button
                                id='time-button'
                                onClick={() => props.booking(time)}
                                key={'button' + i}
                                >
                                    {
                                        time.toString().indexOf('.') >= 0 ? 
                                            time.toString().split('.')[0] + ':' + time.toString().split('.')[1] * 6 :
                                                time.toString().split('.')[0] + ':00'

                                    }
                                </button>
                })
            }
            
            <button
                onClick={() => props.setStage('date-select')}
                >
                Back To Calendar
            </button>

        </div>
    )
}

export default TimeSelection