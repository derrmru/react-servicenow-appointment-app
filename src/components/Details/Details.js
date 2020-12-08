import React, { useState } from 'react'
import axios from 'axios'
import './Details.css'

const Details = (props) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [DOB, setDOB] = useState('');
    const [insurer, setInsurer] = useState('');
    const [email, setEmail] = useState('');

    const kaserRecord = '7f966266db7c2010f787f36f2996196b';

    const submit = (e) => {
        e.preventDefault()
        let dob = DOB + ' 00:00:00';
        let first = firstName.substr(0, 1).toUpperCase() + firstName.slice(1).toLowerCase();
        let last = lastName.substr(0, 1).toUpperCase() + lastName.slice(1).toLowerCase();
        axios.post('/api/now/import/u_patient_import_rest', {
            'u_first_name': first,
            'u_last_name': last,
            'u_full_name': first + ' ' + last,
            'u_patient_dob': dob,
            'u_patient_mop': insurer,
            'u_patient_email': email
        })
          .then(res => {
            console.log(res)
            props.setStage('loading')
            let patient = res.data.result[0]['sys_id']

            let thisDate = props.selectedDate.getFullYear() + '-' + (props.selectedDate.getMonth() + 1) + '-' + props.selectedDate.getDate() + ' 00:00:00'
            axios.post('/api/now/import/u_appointments_import_rest', {
                'u_appointment_clinician': kaserRecord,
                'u_appointment_length': '30',
                'u_appointment_type': 'New Patient',
                'u_glide_date_1': thisDate,
                'u_glide_time_2': props.selectedTime,
                'u_reference_2': patient
            })
                .then (res => {
                    console.log(res)
                    props.setStage('complete')
                })
            
          })
    }

    return (
        <div className="details-container">
            <h3>You have selected {props.selectedDate.toDateString()} at {props.selectedTime}</h3>
            
            <div className='formContainer'>
                <form name={props.contactName} onSubmit={(e) => submit(e)}>
                    <label>
                        First Name:
                        <input type="text" onChange={(e) => setFirstName(e.target.value)} value={firstName} placeholder="e.g. John" required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" onChange={(e) => setLastName(e.target.value)} value={lastName} placeholder="e.g. Smith" required />
                    </label>
                    <label>
                        Date of Birth:
                        <input type="date" onChange={(e) => setDOB(e.target.value)} value={DOB} required />
                    </label>
                    <label>
                        Method of Payment:
                        <select name="insurer" value={insurer} onChange={e => setInsurer(e.target.value)} required>
                            <option value="" disabled defaultValue>-Select a method of payment-</option>
                            <option value="Self-funding">Self-funding</option>
                            <option value="aetna">Aetna</option>
                            <option value="cigna">Allianz</option>
                            <option value="bupa">Bupa</option>
                            <option value="aviva">Aviva</option>
                            <option value="axa-ppp">AXA PPP</option>
                            <option value="axa-ppp-international">AXA PPP International</option>
                            <option value="cigna">Cigna</option>
                            <option value="cigna-international">Cigna International</option>
                            <option value="exeter-friendly">Exeter Friendly</option>
                            <option value="healix">Healix</option>
                            <option value="simply-health">Simply Health</option>
                            <option value="vitality">Vitality</option>
                        </select>
                    </label>
                    <label>
                        Email:
                        <input type="text" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="example@example.com" required />
                    </label>

                    <input id="submit" type="submit" value="submit" />
                </form>
            </div>

            <hr />

            <div className="button-container">
                <button
                    onClick={() => props.setStage('time-selection')}
                    >
                    Back To Time Selection
                </button>

                <button
                    onClick={() => props.setStage('date-select')}
                    >
                    Back To Calendar
                </button>

            </div>

        </div>
    )
}

export default Details