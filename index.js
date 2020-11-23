
const express = require('express');
const server = express();
const bodyParser = require('body-parser')
const cors = require('cors')

// const { connect } = require('./db/index')with await instead


async function runServer() {
    await require('./db/index').connect();
    server.use(bodyParser.json())
    server.use(cors())
    // const portfoliosRoutes = require('./routes/portfolios')

    server.use('/api/v1/portfolios', require('./routes/portfolios'));


    const PORT = parseInt(process.env.PORT, 10) || 3001

    server.listen(PORT, (err) => {
        if (err) console.log(err)
        console.log('Server is ready on port:', PORT)
    })
}

runServer();