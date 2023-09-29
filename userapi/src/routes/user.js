const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  //Route user GET pour la reconnaissance de l'utilisateur
   .get('/:username', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
     // TODO Create get method API
     const username = req.params.username
     userController.get(username, (err, user) => {
      if (err) {
        const respObj = {
          status: "error",
          message: err.message
        };
        return resp.status(404).json(respObj);
      }
      const respObj = {
        status: "success",
        data: user
      };
      resp.status(200).json(respObj);
    });
  
    })
  
module.exports = userRouter
