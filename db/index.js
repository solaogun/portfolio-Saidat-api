

const config = require('../config/dev')

const mongoose = require('mongoose');

const model = require('./models/portfolio')

exports.connect = () => {
    return mongoose.connect(config.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true
    }, (err) => {
        if (err) { console.log(err); }
        else {
            console.log('connected to DB!')
        }

    })
}
