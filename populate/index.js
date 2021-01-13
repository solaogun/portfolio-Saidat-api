



const config = require('../config')

const mongoose = require('mongoose');

const fakeDB = require('./fakeDB')

mongoose.connect(config.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndMaodify: false
}, async (err) => {
    if (err) { console.log(err); }
    else {
        console.log('>Start populating DB ...')
        await fakeDB.populate();
        await mongoose.connection.close();
        console.log('DB has been populated...!')
    }

})

