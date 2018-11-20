var express = require('express');
var app = express();
var bodyParser = require('body-parser')
const { hashSync, compareSync } = require('bcrypt');
const Users = require('./models/users');
const db = require('./models/db');
const Items = require('./models/items')
const { secret } = require('./config');
const { sign, verify } = require('jsonwebtoken');
var path = require('path');

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
let str= "";


app.get('/', function (req, res) {
    // res.send("Hello world!");
    res.sendFile('index.html');
});


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

app.post('/api/signup', async function (req, res) {
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
        res.send(JSON.stringify({"status":"1","code":"201","message":"Additem Succesfully."}));

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
    let data = items[0];
    console.log(data)
    res.status(201);
        res.send({data});
	// Items.find({}, function(err, docs){
    //     var result = docs;
	// 	if(err) res.json(err);
	// 	else    res.send(result, {
    // docs: docs});
	// });
});




app.listen(3001);

console.log("application started on port::", 3001)