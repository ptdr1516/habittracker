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
function getD(x) {
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
        date: newDate,
        day
    };
}

// Feature: view change on the basis of daily and weekly days
router.post('/user-view', (req, res) => {
    User.findOne({
        email
    })
        .then((user) => {
            user.view = user.view === 'daily' ? 'weekly' : 'daily';
            user.save()

            .then((user) => {
                return res.redirect('back');
            })
                .catch((err) => {
                    console.log(err);
                })
                .catch((err) => {
                    console.log('Error while changing view');
                    return;
            })
        })
})

// Adding habits to the controller
router.post('/controller', (req, res) => {
    const { content } = req.body;

    Habits.findOne({ content: content, email: email }).then(habits => {
        if (habits) {
            // updating existing content
            let dates = habits.dates, offset = (new Date()).getTimezoneOffset() * 60000;
            var today = (new Date(Date.now - offset)).toISOString().slice(0, 10);
            dates.find(function (item, index) {
                if (item.date === today) {
                    console.log('Habit Exists');
                    req.flash('errorMsg', 'Habit Already Exists');
                    res.redirect('back');
                }
                else {
                    dates.push({ date: today, complete: 'none' });
                    habits.dates = dates;
                    habits.save()
                          .then(habits => {
                              console.log(habits);
                              res.redirect('back');
                          })
                            .catch((err) => {
                                console.log('Error',err);
                            })
                }
            });
        }
        else {
            let dates = [];
            offset = (new Date()).getTimezoneOffset() * 60000;
            var localISOTime = (new Date(Date.now() - offset)).toISOString().slice(0, 10);
            dates.push({ date: localISOTime, complete: 'none' });
            const newHabit = new Habits({
                content,
                email,
                dates
            });

            // Save the habit
            newHabit
                .save()
                .then(habits => {
                    console.log(habits);
                    res.redirect('back');
                })
                .catch(err => console.log('Error',err));
        }
    })
});



module.exports = router;