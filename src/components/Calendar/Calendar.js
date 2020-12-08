import React, { useEffect, useState } from 'react'
import './Calendar.css'

//array of months for calendar UI
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayArr = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

//functional return of number of days in currently selected month - these are mapped out in the Calendar component
const monthDays = (currentMonth, currentYear) => {
    const limit = new Date(currentYear, currentMonth + 1, 0).getDate();
    let returnArr = [];
    for (let i = 1; i <= limit; i++) {
        returnArr.push(i)
    }
    return returnArr
}

const Calendar = (props) => {
    const date = props.date;
    const [currentMonth, setCurrentMonth] = useState(date.getMonth());
    const [currentYear, setCurrentYear] = useState(date.getFullYear());
    const [tDays, setTDays] = useState([]);

    //if incrementing through months take start and end of years into account
    const setCurrent = (num) => {
        if (num === 1) {
            if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(currentYear + 1)
            } else {
                setCurrentMonth(currentMonth + num)
            }
        }

        if (num === -1) {
            if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(currentYear - 1)
            } else {
                setCurrentMonth(currentMonth + num)
            }
        }
    }

    //calculate start day of the week in current Month
    useEffect(() => {
        let startDay = new Date(1, currentMonth, currentYear).getDay();

        let arr = [];
        for (let i = 0; i < dayArr.length; i++) {
            arr.push(dayArr[(i + startDay) % 7])
        }
        setTDays(arr)

    }, [currentMonth, currentYear])    

    return (
        <div className="calendar">
                    <div className="cal-ui-container">
                        <hr />
                        <div className="cal-header">
                            <button className="cal-nav-button"
                                onClick={() => setCurrent(-1)}
                                >
                                -
                            </button>
                            
                            <h2>{months[currentMonth] + ' ' + currentYear}</h2>
                            
                            <button className="cal-nav-button"
                                onClick={() => setCurrent(1)}
                                >
                                +
                            </button>
                        </div>
                        <hr />
                        <div className="day-names">
                            {
                                tDays.map((day, i) => {
                                    return <div key={"day-name" + i} className="day-name">{day}</div>
                                })
                            }
                        </div>
                        <div className="cal-days">
                            {
                                monthDays(currentMonth, currentYear).map((day, i) => {
                                    let isAvailable = false;
                                    props.availableDates.map(arr => {
                                        if (arr[0] === day && arr[1] === currentMonth) {
                                            return isAvailable = true
                                        }
                                        return isAvailable
                                    })
                                    return (
                                                <button 
                                                    className="day"
                                                    key={'day' + i}
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            return props.updateCalendar(props.name, [day, currentMonth, currentYear])
                                                        }
                                                    }}
                                                    style={ (day === date.getDate() && currentMonth === date.getMonth()) ? 
                                                                {backgroundColor: '#ebebeb', color: 'var(--the-black)'} : 
                                                                    (new Date(currentYear, currentMonth, day) <= new Date() || !isAvailable) ?
                                                                        {color: '#999', backgroundColor: 'white', cursor: 'default'} :
                                                                        {width: '14%'}}
                                                    >
                                                        {day}
                                                </button>
                                            )
                                })   
                            }
                        </div>
                    </div>
        
        </div>
    )
}

export default Calendar