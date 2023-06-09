const User = require('../model/User')
const jwt = require('jsonwebtoken')

// cette methode va nous permettre de regenerer un nouveau token d'access 
const handleRefreshToken =  async (req, res) => {
    
    const cookies = req.cookies 
    console.log("refresh token", cookies.jwt)
    if(!cookies?.jwt) return res.sendStatus(403) 
    console.log("jwt cookies refreshToken ", cookies.jwt)
    const refreshToken = cookies.jwt
    

    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec()
    console.log(foundUser)
    // user does not exist 
    if(!foundUser) return res.sendStatus(403) // Forbidden

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403)
            const roles = Object.values(foundUser.roles)

            const accessToken = jwt.sign(
                {
                    "UserInfo": 
                    {
                        "username": foundUser.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "30s"}   
            )

            // On renvoi un nouveau token d'access 
            // le controller refreshToken consiste a envoyer un nouveau token 
            res.json({ accessToken })
        }
    )
}

module.exports = {handleRefreshToken}