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
//   console.log("json body",req.body)
  return getEmail(req.body.email).then(async (result) => {
      let user = new Users({ email: req.body.email, password: hashSync(req.body.password, 2) });
      user = await user.save();
    //   console.log("user", user)
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
              reject("That user does not exist");
              // throw createError(401, 'That user does not exist');
          } else {
              const user = users[0];
              if (!compareSync(password, user.password)) {
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
//   console.log("body", req.body)
  // console.log("req.body.username",req.body.username)

  return attempt(req.body.email, req.body.password).then(async (data) => {
    //   console.log("data", data)

      payload = {
          "userId": data._id,
          "iat": Math.floor(Date.now() / 1000) - 30,
          "exp": Math.floor(Date.now() / 1000) + (60 * 60),
          "aud": "https://yourdomain.com",
          "iss": "feathers",
          "sub": "anonymous"
      }
    //   console.log("payload", payload)
      let token = await sign(payload, secret);
    //   console.log("token", token)
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
//     console.log('editItem called')
//   console.log("req", req.params.id)
//   console.log('in edititem',req.body.fruit)

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
      res.send(up)
  }
})

app.delete('/deleteItem/(:id)', async function (req, res) {
//   console.log("req",  req.params.id)
  let items = await Items.find({ _id :req.params.id});
  let data = items[0];

  if (items.length == 0) {
    res.status(401);
      res.send("item not exist");
  } else {
     query = { _id: req.params.id  }
     let data = await Items.findOneAndRemove(query)
      res.send(data)
    //   console.log("data",data)
  }
})

app.get('/getitem', function (req, res) {
    var pageOptions = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 10
    }
    
    Items.find()
        .skip(pageOptions.page*pageOptions.limit)
        .limit(pageOptions.limit)
        .exec(function (err, doc) {
            if(err) { res.status(500).json(err); return; };
            res.status(200).json(doc);
        })
    // try{
    // console.log(req.query.pageno)
    // console.log(req.query.size)
    // let pageno = parseInt(req.query.pageno) 
    // let perPage = parseInt(req.query.size) 
    //  if(pageno < 0 || pageno === 0){
    //    res.send({"message":"invalid page number,it should be start with 1"})
    //  }else{
    //     //  sorting= 1( ascending )
    //     //  sorting= -1( descending )
    //     //  limit(size) => limit the record per page
    //     // let perPage = 5
    //     // let page = 1
    //     // let data = await Items.find({})
    //     let data = await Items.find({}).skip(perPage * pageno).limit(perPage).exec()
    //     console.log('data', data)
    //     res.send(data)
    //  }
    // }catch(err) {
    //     res.send(err)
    // }
});


app.listen(process.env.PORT || 3001)

console.log("application started on port::", 3001)