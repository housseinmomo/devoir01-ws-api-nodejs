const User = require('../model/User')


const getAllUsers = async (req, res) => {
    const users = await User.find()
    if (!users) return res.status(204).json({"message": "No users found."}) // 204: No content 
    res.json(users)
}

const getUser = async (req, res) => {
    
    if(!req?.params?.id) return res.status(400).json({"message": "user ID required"})

    const user = await User.findOne({_id: req.params.id}).exec()
    
    if(!user) return res.status(400).json({"message": `Emplyee ID ${req.params.id} not found.`})
    
    res.json(user) 
}

const createNewUser = async (req, res) => {
    // create new user object 
    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({"message": "First and last names are required"})
    }    

    try {
        const result = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        })
        res.status(201).json(result)
    } catch(err) {
        console.error(err)
    }
}

const updateUser = async (req, res) => {
    
    if(!req?.body?.id) {
        return res.status(400).json({"message": "ID parameter is required."})
    }

    const user = await User.findOne({_id: req.body.id}).exec()
    
    if(!user){
        return res.status(204).json({"message": `No user matches ID ID ${req.body.id}.`})
    }

    if(req.body.firstname) user.firstname = req.body.firstname
    if(req.body.lastname) user.lastname = req.body.lastname

    const result = await user.save()
    res.json(result)
    
}

const deleteUser = async (req, res) => {
    
    if(!req?.body?.id) return res.status(400).json({"message": "user ID required."})
    
    const user = await User.findOne({_id: req.body.id}).exec()
    
    if(!user){
        return res.status(204).json({"message": `No user matches ID ID ${req.body.id}.`})
    }

    const result = await User.deleteOne({_id: req.body.id})
    res.json(result)
}


module.exports = {
    getAllUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser
}
