const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const handleLogin = async (req, res) => {
    
    const user = req.body.user
    const pwd = req.body.pwd
    console.log(user, pwd);
    if(!user || !pwd) { return res.status(400).json({"message": "Username and password are required."}) }
    // find user with username 

    const foundUser = await User.findOne({username: user}).exec()

    // user does not exist 
    if(!foundUser) return res.sendStatus(401) // Unauthorized

    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean)
        // create JWT (JSON Web Token) :creation de token qui va nous permettre de creer des routes securiser 
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15s' } // en production, on met en moyenne 5 min
        )        
        
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // en production, on met en moyenne 5 min
        )

        // Saving refreshToken with current user in database
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        console.log(result)

        // Une fois que l'authentification est terminer donne token d'accees 
        res.cookie('jwt', refreshToken, {httpOnly: true})    // secure: true     // sameSite: "None", maxAge: 24 * 60 * 60 * 1000
        res.json({ roles ,accessToken })
    } else { 
        res.sendStatus(401) // Unauthorized
    }   

    return res
}

module.exports = {handleLogin}