const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:  String,
    description: String,
    duration: Number,
    date: String
  });
const User = mongoose.model('URL', userSchema);


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Add new user
app.post('/api/exercise/new-user',(req, res, next) => {
  console.log(req.body.username)
  const newUser = new User({
      username: req.body.username
    })
  newUser.save((err) => {
    if(err) console.log(err);
  })
  res.send({"username":newUser.username,"id":newUser._id});
  next();
});


// Get all users
app.get('/api/exercise/users', (req, res, next) => {
  
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
