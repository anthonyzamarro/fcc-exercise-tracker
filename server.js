// ### User Stories

// 3. I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. 
// If no date supplied it will use current date. Returned will be the user object with the exercise fields added.
// 4. I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). 
// Return will be the user object with added array log and count (total exercise count).
// 5. I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:  String
  });
const User = mongoose.model('User', userSchema);


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Add new user
app.post('/api/exercise/new-user',(req, res, next) => {
  const newUser = new User({
      username: req.body.username
    })
  newUser.save((err) => {
    if(err) console.log(err);
  })
  res.send({"username":newUser.username,"id":newUser._id});
  // next();
});


// Get all users
app.get('/api/exercise/users', (req, res) => {
  User.find({}, (err, users) => {
    if (err) console.log(`error in find: ${err}`);
      res.send(users);
  })
});

// Add exercise
app.post('/api/exercise/add', (req, res, next) => {
  const id = req.body.userId;
  const des = req.body.description;
  const dur = req.body.duration;
  let date = req.body.date;
  if (date === '') {
    date = new Date();
  }
  // User.add({
  //   count: Number,
  //   log: [{description: String, duration: Number, date: Date}]
  // });
  User.findById(id, (err, user) => {
    user.log = user.log.concat([{description: des, duration: dur, date: date}]);
    user.save((err) => {
      if(err) console.log(`findById error: ${err}`);
    });
    console.log(user);
  });
  next();
});

// app.post("/api/shorturl/new", function(req,res,next) {
//   const userUrl = req.body.url;
//   if (validUrl.isWebUri(userUrl)){
//     const newUrl = new URL({name: userUrl, index: Math.round((Math.random().toFixed(4) * 1000))});
//     newUrl.save(function (err) {
//     if (err) return console.log('save error',err);
//     });
//     res.send({"original_url":newUrl.name,"short_url":newUrl.index});
//   } else {
//     res.send({"error":"invalid URL"});
//   }
//   next();
// });




// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
