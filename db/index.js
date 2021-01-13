

const config = require('../config')

const mongoose = require('mongoose');

require('./models/portfolio')
require('./models/blog')


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
