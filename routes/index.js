const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Habits = require('../models/Habits');

router.get('/', (req, res) => {
    res.render('homepage')
});


// Controller
var email = "";
router.get('/controller', (req, res) => {
    email = req.query.user;
    User.findOne({
        email: req.query.user
    }).then(user => {
        Habits.find({
            email: req.query.user
        }, (err, habits) => {
            if (err) {
                console.log(err);
            }
            else {
                var days = [];
                days.push(getD(0));
                days.push(getD(1));
                days.push(getD(2));
                days.push(getD(3));
                days.push(getD(4));
                days.push(getD(5));
                days.push(getD(6));
                res.render('controller', { habits, user, days });
            }
        });
    })
});

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