const jwt = require('jsonwebtoken')
const blogModel = require('../models/blogmodel')
const mongoose = require('mongoose')

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-api-key"]; //=======handleing case sensitivty =========================
        if (!token) {
            return res.status(401).send({ status: false, msg: "token must be present" })
        };
        //============================= decoding the token ========================================
        let decodedToken = jwt.verify(token, "Blogging_site_group_35", function (error, decodedToken) {
            if (error) {
                return res.status(401).send({ status: false, msg: "token is invalid" })
            } else {
                req.loggedInAuthorId = decodedToken._id
                next()
            }
        });
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }

}



const authorisation = async function (req, res, next) {
    try {
        let blogToBeModified = req.params.blogId
        //========================= if blogId is not valid ================================================
        if (!mongoose.isValidObjectId(blogToBeModified)) {
            return res.status(400).send({ status: false, msg: "invalid blogId format" });
        }
        //================================= to check authority ===========================================
        let blog = await blogModel.findById({ _id: blogToBeModified })
        if (blog) {
            if (blog.authorId != req.loggedInAuthorId) {
                return res.status(403).send({ status: false, msg: 'Author loggedIn is not allowed to modify the requested data' })
            } else {
                next()
            }
        }
        else {
            return res.status(404).send({ status: false, msg: "blogId does not exist" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}




const authorisationQuery = async function (req, res, next) {
    try {
        let dataQuery = req.query
        if (dataQuery.authorId) {
            if (!mongoose.Types.ObjectId.isValid(dataQuery.authorId)) {
                return res.status(400).send({ status: false, msg: "invalid authorId format" });
            }
        }
        //=============== if entry in query params ===============================================
        if (!(Object.keys(dataQuery).length === 0)) {
            const dataToDelete = await blogModel.find(dataQuery)

            if (dataToDelete.length > 0) {
                const blogAuth = dataToDelete.map((blog) => {
                    let x = blog.authorId.toString()
                    return x
                })
                if (!blogAuth.includes(req.loggedInAuthorId)) {
                    return res.status(403).send({ status: false, msg: 'Author loggedIn is not allowed to modify the requested data of other author' })
                }
                next()
            }
            else{
                return res.status(404).send({ status: false, message: "No matching blog found to be deleted" })
            }
        }
        //================== no entry in query params ==========================================
        else {
            return res.status(404).send({ status: false, message: "please provide filters to fetch data to be deleted" })
        }
    }
    catch (error) {
        return res.status(500).send({ status: false, Error: error.message })
    }
}




module.exports = { authentication, authorisation, authorisationQuery }