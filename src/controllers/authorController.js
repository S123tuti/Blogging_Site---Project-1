const authorModel = require('../models/authormodel')
const jwt = require('jsonwebtoken')


//-------------------------------------------------- APIs /authors --------------------------------

const createAuthors = async function (req, res) {
    try {

        const emailRegex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
        const nameRegex = /^[a-z\s]+$/i
        const passwordRegex = /^(?!.\s)[A-Za-z\d@$!%?&]{8,}$/

        //=========================================== user not entered any data ==========================================
        let authorData = req.body
        if (Object.keys(authorData).length == 0) {
            return res.status(400).send({ status: false, message: "please enter data" })
        }

        //====================================Validating fname ================================================
        if (!authorData.fname) {
            return res.status(400).send({ status: false, message: "fname is required" })
        }
        if (!authorData.fname.match(nameRegex)) {
            return res.status(400).send({ status: false, message: "Invalid format of fname" })
        }
        //================================ VALIDATING lname ===============================================
        if (!authorData.lname) {
            return res.status(400).send({ status: false, message: "lname is required" })
        }
        if (!authorData.lname.match(nameRegex)) {
            return res.status(400).send({ status: false, message: "Invalid format of lname" })
        }

        //=======================================title validation =============================================
        if (!authorData.title) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        if (["Mr", "Mrs", "Miss"].indexOf(authorData.title) == -1) {
            return res.status(400).send({ status: false, message: "please enter Mr , Mrs, Miss" })
        }
        //=========================================email validation =============================================
        if (!authorData.email) {
            return res.status(400).send({ status: false, message: "email is required." })
        }
        if (!authorData.email.match(emailRegex)) {
            return res.status(400).send({ status: false, message: "Invalid Format of email." })
        }
        let emailAlreadyExist = await authorModel.findOne({ email: authorData.email })
        if (emailAlreadyExist) {
            return res.status(400).send({ status: false, message: "Email already exist." })
        }

        //====================================== password validation =======================================       
        if (!authorData.password) {
            return res.status(400).send({ status: false, message: "password is required" })
        }
        if (!passwordRegex.test(authorData.password)) {
            return res.status(400).send({ status: false, message: "Invalid format of password" })
        }

        //========================================= author created ========================================
        let createdAuthor = await authorModel.create(authorData)
        return res.status(201).send({ status: true, message: "Author created sucessfully", data: createdAuthor })

    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


//--------------------------------------------- get /authors -------------------------------------------------

const getAuthor = async function (req, res) {
    try {
        let alldata = await authorModel.find()
        return res.status(200).send({ status: true, data: alldata })
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}


//-----------------------------------------------POST /login------------------------------------------------

const authorLogin = async function (req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        let user = await authorModel.findOne({ email: userName, password: password });
        //======================== if body is empty =============================================
        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, msg: "Data is required" })
        }
        //============================= if username is not entered ====================================
        if (!userName) {
            return res.status(400).send({ status: false, msg: "UserName is required" })
        }
        //================================= if password id not entered ================================
        if (!password) {
            return res.status(400).send({ status: false, msg: "Password is required" })
        }
        //===================================== if no matching data found =======================================
        if (!user) {
            return res.status(401).send({ status: false, msg: "UserName or Password incorrect" });
        }
        //=============================== token generation =====================================================
        let payload = { _id: user._id, Group: "Group35", projectName: "BloggingSite" }
        let token = jwt.sign(payload, "Blogging_site_group_35");
        return res.status(201).send({ status: true, token: token });
    }
    catch (error) {
        return res.status(500).send({ staus: false, msg: error.message })
    }
};

module.exports = { createAuthors, getAuthor, authorLogin }
