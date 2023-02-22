// import React from 'react'
// import Top from './partial/top'
const express = require('express')
const mysql = require('mysql')
const cors = require('cors');
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const bodyparser = require('body-parser');
const saltRounds = 10
const app = express()


app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true
}));
// app.use(cors())
// app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());

app.use(session({
    key: 'userId',
    secret: 'heyyy',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },

}))
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lions'
});

function auth(req, res, next) {
    // console.log('im the middle ware')
    const user = req.body.aUser
    const pass = req.body.aPwd
    // db.query(
    //     'SELECT * FROM login WHERE username=?;',
    //     user,
    //     (err, result) => {
    //         if (err) {
    //             console.log('err is', err)
    //         }
    //         console.log('result', result)
    //         if (result.length > 0) {
    //             bcrypt.compare(pass, result[0].password, (err, resp) => {
    //                 if (resp) {
    //                     req.session.user = result;
    //                     // res.redirect()
    //                     // next()
    //                     console.log('in bcrypt')
    //                     next()
    //                 } else {
    //                     console.log('wrong credentials')
    //                 }
    //             })
    //         } else {
    //             console.log('user not found')
    //         }
    //     }
    // )
}

app.post('/insert', (req, res) => {
    const title = req.body.aTitle
    const guest = req.body.aGuest
    const date = req.body.aDate
    const district = req.body.aDis
    const desc = req.body.aDesc
    const venue = req.body.aVenue
    const sqlInsert = "INSERT INTO events (eventTitle,chiefGuest,date,district,description,venue) VALUES(?,?,?,?,?,?)";
    // console.log(title)
    db.query(sqlInsert, [title, guest, date, district, desc, venue], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log('inserted')
        }
    })
})

app.post('/register', (req, res) => {
    const username = req.body.aUser
    const password = req.body.aPwd
    const sqlInsert = "INSERT INTO login (username,password) VALUES(?,?)";

    bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(sqlInsert, [username, hash], (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log('inserted')
            }
        })
    })

})

const middleware = (req, res, next) => {
    const user = req.body.aUser
    const pass = req.body.aPwd
    db.query(
        'SELECT * FROM login WHERE username=?;',
        user,
        (err, result) => {
            if (err) {
                console.log('err is', err)
            }
            const des = result[0].designation
            // console.log('result', result)
            if (result.length > 0) {
                bcrypt.compare(pass, result[0].password, (err, resp) => {
                    if (resp) {
                        req.session.user = result;
                        res.status(200).json({
                            success: true,
                            designation: des
                        });
                    } else {
                        res.status(401).json({
                            success: false
                        });
                    }
                })
            } else {
                // console.log('user not found')
                res.status(401)
            }
        }
    )
    next();
}

app.post('/login', middleware, (req, res) => {
    const user = req.body.aUser
    const pass = req.body.aPwd

})



app.listen(3001, (req, res) => {
    console.log('running 3001')
})