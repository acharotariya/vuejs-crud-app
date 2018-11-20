const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { hashSync, compareSync } = require('bcrypt');
const Users = require('../models/users');
const db = require('../models/db');
const Items = require('../models/items')
const { secret } = require('../config');
const { sign, verify } = require('jsonwebtoken');

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

app.get('/posts', (req, res) => {
    res.send(
      [{
        title: "Hello World!",
        description: "Hi there! How are you?"
      }]
    )
  })
  
app.post('/posts', (req, res) => {
  console.log('req ===>',req)
  var email = req.body.email;
  var password = req.body.password;
  var user = new Users({
    email: email,
    password: password
  })

  user.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Post saved successfully!'
    })
  })
})  

let getEmail = function (email) {
  promise = new Promise(function (resolve, reject) {
      Users.find({ email: email }).exec().then((users, err) => {
          console.log("users",users)
          if (users.length) {
              reject('That email already exist');
          } else {
              resolve('not exist')
          }
      })
  })

  return promise;
}

app.post('/signup', async function (req, res) {
  console.log("json body",req.body)
  return getEmail(req.body.email).then(async (result) => {
      let user = new Users({ email: req.body.email, password: hashSync(req.body.password, 2) });
      user = await user.save();
      console.log("user", user)
      res.send(JSON.stringify({ status: 1, code: 200, message: 'you are successfully register...' }));
  }).catch((err) => {
      console.log("err >>>>>>>>>>>>>>", err)
      res.status(409);
      res.send(err);
  })
});


let attempt = function (email, password) {
  promise = new Promise(function (resolve, reject) {
      Users.find({ email: email }).exec().then((users) => {
          console.log("users", users)
          if (!users.length) {
              // res.status(401);
              reject("That user does not exist");
              // throw createError(401, 'That user does not exist');
          } else {
              const user = users[0];
              if (!compareSync(password, user.password)) {
                  // res.status(401);
                  reject("password doesn't match");
                  // throw createError(401, "password doesn't match");
              } else {
                  resolve(user);
              }
          }
      })
  })
  return promise;
};

app.post('/login', async function (req, res) {
  console.log("body", req.body)
  // console.log("req.body.username",req.body.username)

  return attempt(req.body.email, req.body.password).then(async (data) => {
      console.log("data", data)

      payload = {
          "userId": data._id,
          "iat": Math.floor(Date.now() / 1000) - 30,
          "exp": Math.floor(Date.now() / 1000) + (60 * 60),
          "aud": "https://yourdomain.com",
          "iss": "feathers",
          "sub": "anonymous"
      }
      console.log("payload", payload)
      let token = await sign(payload, secret);
      console.log("token", token)
      res.send(JSON.stringify({ status: 1, code: 200, message: 'you are successfully login...' ,logintoken:token}));
  }).catch((err) => {
      console.log("err >>>>>", err)
      res.status(401);
      res.send(err);
  })
})

app.post('/additem', async function (req, res) {
 console.log("body", req.body)
  let item = new Items({ fruit: req.body.fruit, price: req.body.price  });
      itemdata= await item.save();
      console.log("itemdata",itemdata)
      // res.status(201);
      res.send(JSON.stringify({"status":"1","code":"201","message":"Additem Succesfully.","data": itemdata}));

})

app.put('/editItem/(:id)', async function (req, res) {
  console.log("req", req.params.id)
  let items = await Items.find({ _id: req.params.id });
  let data = items[0];

  if (items.length == 0) {
    res.status(401);
      res.send("item not exist");
  } else {
     query = { _id: req.params.id  }
      const update = {
          $set: { "fruit": req.body.fruit, "price": req.body.price, "updated_at": new Date() }
      };

      let up = await Items.findOneAndUpdate(query, update, { returnNewDocument: true, new: true })

      console.log("up",up)
  }
})

app.delete('/deleteItem/(:id)', async function (req, res) {
  console.log("req",  req.params.id)
  let items = await Items.find({ _id :req.params.id});
  let data = items[0];

  if (items.length == 0) {
    res.status(401);
      res.send("item not exist");
  } else {
     query = { _id: req.params.id  }
     let data = await Items.findOneAndRemove(query)

      console.log("data",data)
  }
})

app.get('/getItem', async function(req, res){
let items = await Items.find({});
console.log('items', items)
  let data = items
  console.log('data', data)
  res.status(201);
      res.send(data);
// Items.find({}, function(err, docs){
  //     var result = docs;
// 	if(err) res.json(err);
// 	else    res.send(result, {
  // docs: docs});
// });
});


app.listen(process.env.PORT || 3001)

console.log("application started on port::", 3001)