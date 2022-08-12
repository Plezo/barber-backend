const express = require('express');
const router = express.Router();

const Appointment = require('../models/Appointment.js');

// move this to frontend when possible
function isValidEmail(email) {
    const re = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return re.test(email);
}

// move this to frontend when possible
function isValidPhone(phone) {
    const re = new RegExp('\d{10}');
    return re.test(phone);
}

/*

Fetch all appointments on the selected date (selection will be frontend)
Return all available times in 30 min increments (increments based off of how long haircuts take on avg)
Available time is a 30 min interval that does not intersect any other appointment interval

*/

// move this to frontend when possible
function getAllTimes(appointments, work_hours) {
    const result = [];
        
    let value = work_hours[0], i = 0;

    while (value < work_hours[1] && i < appointments.length) {
        let [left, right] = appointments[i];
        if (value < left) result.push([new Date(value * 1000), new Date(left * 1000)]);
        value = right;
        i++;
    }
    if (value <= work_hours[1]) result.push([new Date(value * 1000), new Date(work_hours[1] * 1000)]);

    // TODO: format the result in hour time slots
    // i.e. [9, 12] -> [[9, 10], [10, 11], [11, 12]]

    return result;
};

// Assumes every appointment is 1 hour long
// try changing to 30 min instead
async function getAllAppointmentTimes(day_selected) {

    const filter = {
        start_time: {
            $gte: new Date(day_selected * 1000),            // day 00:00:00
            $lte: new Date((day_selected + 86399) * 1000)   // day 23:59:59
        },
        cancelled: false
    }

    // fetch all appointments at selected day, sorted
    const appointments = await Appointment.find(filter).sort({ start_time: 'asc' });

    const result = [];
    appointments.forEach(obj => {
        let interval = [
            Math.floor(obj.start_time.getTime() / 1000),
            Math.floor(obj.start_time.getTime() / 1000) + 3600 // + 1 hour
        ]
        result.push(interval);
    });

    return result;
}

function createWorkHours(selected_day, hours=[9, 18]) {

    let start = selected_day + (3600 * hours[0]);
    let end = selected_day + (3600 * hours[1]);

    const workHours = [start, end];
    return workHours;
}

router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (err) {
        res.json({ message: err });
    }
});

router.post('/', async (req, res) => {
    // move this to frontend when possible
    if (!isValidEmail(req.body.client_email) && req.body.client_email != null) {
        res.json({ message: "Email not valid!" })
        return;
    }

    // move this to frontend when possible
    // needs fixing
    // if (!isValidPhone(req.body.client_phone)) {
    //     res.json({ message: "Phone number not valid!" });
    //     return;
    // }

    const appointment = new Appointment({
        id: req.body.id,
        client_name: req.body.client_name,
        client_phone_number: req.body.client_phone_number,
        client_email: req.body.client_email,
        start_time: req.body.start_time,
        end_time_expected: req.body.end_time_expected,
        cancelled: req.body.cancelled
    });

    try {
        const savedAppointment = await appointment.save();
        res.json(savedAppointment);
    } catch (err) {
        res.json({ message: err });
    }
});

// WILL NOT BE IN PROD!
router.post('/getFreeTimes', async (req, res) => {
    // const dateSelected = new Date('2022-08-12T13:00:00');
    const dateSelected = Math.floor(new Date(req.body.date).getTime() / 1000);
    const workHours = [9, 18];

    const appointments = await getAllAppointmentTimes(dateSelected);
    res.json(getAllTimes(appointments, createWorkHours(dateSelected, workHours)));
})

module.exports = router;