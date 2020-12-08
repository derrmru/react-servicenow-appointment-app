import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar/Calendar';
import TimeSelection from './components/TimeSelection/TimeSelection';
import Details from './components/Details/Details';
import Complete from './components/Complete/Complete';
import Loading from './components/Loading/Loading';
import axios from 'axios'
import './App.css';

const App = () => {
  const [availability, setAvailability] = useState([]);
  const [result, setResult] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState();
  const [availableTimes, setAvailableTimes] = useState();
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [stage, setStage] = useState('date-select');
  let availableDates = [];

  useEffect(async () => {//inital call for available days
     axios.get('/api/now/table/u_availability?sysparm_query=u_clinic_date%3E%3Djavascript%3Ags.beginningOfToday()%5Eu_room_clinician%3D7f966266db7c2010f787f36f2996196b&sysparm_display_value=true')
          .then(res => {
            res.data.result.map((x, i) => {
                availableDates.push(x['u_clinic_date'].split('.'))
                availableDates[i].map((y, j) => {
                    return availableDates[i][j] = parseInt(y)
                  })
                return availableDates[i][1] -= 1
              })
            setAvailability(availableDates)//stores available Dates to be passed to Calendar component
            setResult(res.data.result);//stores results, which contains start and end of clinics, in order to determine available times when day has been selected
          })
  },[])

  const updateCalendar = (name, date) => {
    setStage('loading')
    //first find start and end of selected clinic
    result.map((day, i) => {
      let arr = day['u_clinic_date'].split('.');
      arr.map((n, j) => arr[j] = parseInt(n));
      arr[1] = arr[1] - 1;
      if (arr.join('.') === date.join('.')) {
          setStartTime(result[i]['u_clinic_start_time'])
          setEndTime(result[i]['u_clinic_end_time'])
       }
      return '';  
    })

    axios.get('/api/now/table/u_appointments?sysparm_query=u_appointment_clinician%3D7f966266db7c2010f787f36f2996196b%5Eu_glide_date_1%3E%3Djavascript%3Ags.beginningOfToday()&sysparm_display_value=true')
      .then(res => {
        //console.log(res)
        let appArr = []
        res.data.result.map(appoint => appArr.push([appoint['u_glide_time_2'], appoint['u_appointment_length']]))
        setAvailableTimes(appArr)
        setStage('time-selection');
      })

    setSelectedDate(new Date(date[2], date[1], date[0]))
  }

  const booking = (selectedTime) => {
    //console.log(selectedDate + ' ' + selectedTime)
    setStage('loading')
    let stringTime = selectedTime.toString();
    if(selectedTime.toString().indexOf('.') > 0){//format to time string for posting
      setSelectedTime(stringTime.split('.')[0] + ':' + stringTime.split('.')[1] * 6 + ':00')
    } else {
      setSelectedTime(stringTime + ':00:00')
    }
    setStage('booking-details')
  }

  return (
    <div className="App">
      <h1 className="App-title">Book an Appointment</h1>
      <hr />
      <h2 className="App-sub-title">London Foot & Ankle Surgery</h2>

      <div className="cal-container">
        {stage === 'date-select' ?
          <Calendar 
            name='available-dates'
            date={selectedDate} 
            availableDates={availability}
            updateCalendar={updateCalendar}
            /> :
            stage === 'time-selection' ?
              <TimeSelection 
                date={selectedDate}
                setStage={setStage}
                availableTimes={availableTimes}
                startTime={startTime}
                endTime={endTime}
                booking={booking}
                /> :
              stage === 'booking-details' ?
                <Details 
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  setStage={setStage}
                  /> :
                  stage === 'complete' ? 
                    <Complete /> :
                      <Loading />
        }
      </div>

    </div>
  )
}

export default App;
