const { json } = require('body-parser');
const request = require('request');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const config = require('../config')

//authentication middleware
//this middleware will check access token in authorisation headers of a request
//it will verify access token against auth0 json web key set
exports.checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: 'https://saidatcode.us.auth0.com/.well-known/jwks.json',
    }),
    audience: 'https://saidatcode.us.auth0.com/api/v2/',
    issuer: 'https://saidatcode.us.auth0.com/',
    algorithms: ['RS256']
})

exports.checkRole = role => (req, res, next) => {
    const user = req.user
    if (user && user[config.AUTH0_NAMESPACE + '/roles'].includes(role)) {
        next();
    } else {
        return res.status(401).send('You are not authorized to access the role')
    }

}

exports.getAccessToken = (callback) => {
    const options = {
        method: 'POST',
        url: config.AUTH0_TOKEN_URL,
        headers: { 'content-type': 'application/json' },
        form: {
            grant_type: 'client_credentials',
            client_id: config.AUTH0_CLIENT_ID,
            client_secret: config.AUTH0_CLIENT_SECRET,
            audience: config.AUTH0_AUDIENCE
        }
    }

    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) {
                return reject(new Error(error))
            }
            resolve(body ? JSON.parse(body) : '')
        })
    })


}

exports.getAuth0User = access_token => userId => {
    const options = {
        method: 'GET',
        url: `${config.AUTH0_DOMAIN}/api/v2/users/${userId}?fields=name,picture,user_id`,
        headers: { authorization: `Bearer ${access_token}` }
    }
    return new Promise((resolve, reject) => {
        request(options, function (error, res, body) {
            if (error) {
                return reject(new Error(error))
            }
            resolve(body ? JSON.parse(body) : '')
        })
    })
}