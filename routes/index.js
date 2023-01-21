const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Habits = require('../models/Habits');

router.get('/', (req, res) => {
    res.render('homepage')
});


// Controller


// Handling Month Dates
function getDate(x) {
    let d = new Date();
    d.setDate(d.getDate() + x);

    var newDate =
        d.toLocaleDateString('pt-br')
            .split('/')
            .reverse()
            .join('-');

    var day;

    switch (d.getDay()) {
        case 0: day = 'Sun'; break;
        case 1: day = 'Mon'; break;
        case 2: day = 'Tue'; break;
        case 3: day = 'Wed'; break;
        case 4: day = 'Thu'; break;
        case 5: day = 'Fri'; break;
        case 6: day = 'Sat'; break;
    }

    return {
        date: newDate(),
        day
    };
}

module.exports = router;