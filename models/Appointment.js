const mongoose = require('mongoose');

const AppointmentSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    client_name: {
        type: String,
        required: false
    },
    client_phone_number: {
        type: String,
        required: true
    },
    client_email: {
        type: String,
        required: false
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time_expected: {
        type: Date,
        required: true
    },
    cancelled: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Appointment', AppointmentSchema);