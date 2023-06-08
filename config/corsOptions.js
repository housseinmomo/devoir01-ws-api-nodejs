// Aller a la derniere ligne des requetes 
const allowOrigins = require('./allowOrigins')


// let corsOptions = {
//     origin: true,
//     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
//     credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
// }


const originIsLigitime = (req, res) => {

    // // console.log(req?.headers?.origin)
    // const origin = req.headers.origin

    // if(allowOrigins.indexOf(origin) === -1) {
    //     console.log(origin + " is into a blacklist")
    //     corsOptions.origin = false
    // }
    // console.log(origin + " is not into blacklist")
    // corsOptions.origin = true 

    // return corsOptions

    const origin = req?.headers.origin
    console.log(origin)
    const originIsValid = allowOrigins.indexOf(origin)
    console.log(originIsValid)
    if ( originIsValid === -1){
        console.log("accees refuser a : " + origin)
        corsOptions.origin = false
        console.log(corsOptions)
        return corsOptions 
    }
    console.log("access autoriser a " + origin)
    corsOptions.origin = true
    console.log(corsOptions)
    return corsOptions
}

const corsOptions = {
    origin: (origin, callback) => {
        if (allowOrigins.indexOf(origin) !== -1 || !origin) {
            console.log("Accees autotiser")
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200
}

  

module.exports = {corsOptions}