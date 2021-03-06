const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()

const router = require('./router')

const cors = require('cors')

// const mongoose = require('mongoose')
// mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     username:  String,
//     count: Number,
//     log: [{description: String, duration: Number, date: Date}]
//   });

// const User = mongoose.model('User', userSchema);


app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

app.use('/api/exercise', router);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// // Add new user
// app.post('/api/exercise/new-user',(req, res, next) => {
//   const newUser = new User({
//       username: req.body.username
//     })
//   newUser.save((err) => {
//     if(err) console.log(err);
//   })
//   res.send({"username":newUser.username,"id":newUser._id});
//   // next();
// });

// // Get all users
// app.get('/api/exercise/users', (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) console.log(`error in find: ${err}`);
//       let nameAndId = users.map(user => {
//         return {username: user.username, id: user._id}
//       });
//       res.send(nameAndId);
//   })
// });

// // Add exercise
// app.post('/api/exercise/add', (req, res, next) => {
//   const id = req.body.userId;
//   const des = req.body.description;
//   const dur = req.body.duration;
//   let date = req.body.date;
//   // validate Date input
//   if (date === '') {
//     let newDate = Date.now();
//     date =  moment(newDate).format('YYYY-MM-DD');
//   } else if (!moment(req.body.date, 'YYYY-MM-DD',true).isValid()) {
//     res.json(`${date} is an invalid date. Please enter a valid date in the format YYYY-MM-DD`);
//     return;
//   }
//   User.findById(id, (err, user) => {
//     user.log = user.log.concat([{description: des, duration: dur, date: date}]);
//     let logCount = user.log.length;
//     user.count = logCount;
//     user.save((err) => {
//       if(err) console.log(`findById error: ${err}`);
//     });
//     res.send({username: user.username, description: des, duration: dur, id: id, date: date});
//   });
// });

// // Get user logs, optionally sort
// // /api/exercise/log?userId=5c792bb9c7e55d1e93da420d
// // /api/exercise/log?userId=5c792bb9c7e55d1e93da420d&from=2019-03-14&to=2019-03-22
// // start and end date are exclusive
// app.get('/api/exercise/log?:userId', (req, res, next) => {
//   let userId = req.query.userId;
//   let fromParam = req.query.from;
//   let to = req.query.to;
//   let limit = req.query.limit;
//   let filteredByDate, limited, count;
  
//   User.findById(userId, (err, user) => {
//     if (err) return res.send('<h1>userId not found. Please enter a valid userId.</h1>');
//     // console.log(user.log);
//     /*
//       if from and to are present, then get in between
//       else if from is only present, then get dates after provided date
//       else if to is only present, then get dates up to provided date
      
//       if filteredByDate is !undefined, then slice(0, limit)
//       else user.logs.slice(0, limit)
//     */
//     if (fromParam && to) {
//       filteredByDate = user.log.filter(logObj => {
//           if (moment(logObj.date).isBetween(fromParam, to)) {
//             return logObj
//           }
//       });
//     } else if (fromParam && to === undefined) {
//       filteredByDate = user.log.filter(logObj => {
//           if (moment(logObj.date).isAfter(fromParam)) {
//             return logObj
//           }
//       });
//     } else if (fromParam === undefined && to) {
//       filteredByDate = user.log.filter(logObj => {
//           if (moment(logObj.date).isBefore(to)) {
//             return logObj
//           }
//       });
//     }
//     if (filteredByDate !== undefined) {
//       limited = filteredByDate.slice(0, limit);
//       count = limited.length;
//     } else {
//       limited = user.log.slice(0, limit);
//       count = limited.length;
//     }
//     if(filteredByDate && limited) {
      
//       return res.send({_id: user._id, username: user.username, count: count, log: limited});
//     } else if (filteredByDate === undefined && limited) {
//       return res.send({_id: user._id, username: user.username, count: count, log: limited});
//     } else {
//       return res.send(user);
//     }
    
//     // console.log(limited);
//     // res.send(user);
//   });
//   // const u = User.findById(userId).sort();
//   // console.log(u)
//   // next();
// });


// https://fuschia-custard.glitch.me/api/exercise/log?userId=SyjKV2O8V



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
