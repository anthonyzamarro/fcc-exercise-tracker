const User = require('./UserSchema');
const moment = require('moment');


// Add a User
// const createUser = (req, res) => {
//   const newUser = new User({
//       username: req.body.username
//     })
//   newUser.save((err) => {
//     if(err) console.log(err);
//   })
//   res.send({"username":newUser.username,"id":newUser._id});
// }

const createUser = (username, cb) => {
	const newUser = new User({
		username: username
	});
	newUser.save((err) => {
		if(err) console.log(err)
	})
	const response = {"username":newUser.username,"id":newUser._id};
	return cb(response, 200);
}

// Get All Users
// const getAllUsers = (req, res) => {
//   User.find({}, (err, users) => {
//     if (err) console.log(`error in find: ${err}`);
//       let nameAndId = users.map(user => {
//         return {username: user.username, id: user._id}
//       });
//       res.send(nameAndId);
//   })
// }

const getAllUsers = cb => {
	User.find({}, (err, users) => {
		if (err) console.log(`error in find: ${err}`);
		let nameAndId = users.map(user => {
        return {username: user.username, id: user._id}
      });
		return cb(nameAndId);
	})
}

// Add Exercise to Single User
// const addExercise = (req, res, next) => {
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
// };

const addExercise = (userId, userData, cb) => {
  let returnObj
  User.findById(userId, (err, user) => {
    user.log = user.log.concat([{description: userData.des, duration: userData.dur, date: userData.date}]);
    let logCount = user.log.length;
    user.count = logCount;
    user.save((err) => {
      if(err) console.log(`findById error: ${err}`);
    });

    returnObj = user.log;
    
	cb(returnObj);
  });
}

// Get Log from Single User
// Get user logs, optionally sort
// /api/exercise/log?userId=5c792bb9c7e55d1e93da420d
// /api/exercise/log?userId=5c792bb9c7e55d1e93da420d&from=2019-03-14&to=2019-03-22
// start and end date are exclusive
// const getLogs = (req, res, next) => {
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

//   });
// };
const getLogs = (data, cb) => {
	let filteredByDate, limited, count;

	User.findById(data.userId, (err, user) => {
    if (err) return cb('<h1>userId not found. Please enter a valid userId.</h1>');
    
    if (data.fromParam && data.to) {
      filteredByDate = user.log.filter(logObj => {
          if (moment(logObj.date).isBetween(data.fromParam, data.to)) {
            return logObj
          }
      });
    } else if (data.fromParam && data.to === undefined) {
      filteredByDate = user.log.filter(logObj => {
          if (moment(logObj.date).isAfter(data.fromParam)) {
            return logObj
          }
      });
    } else if (data.fromParam === undefined && data.to) {
      filteredByDate = user.log.filter(logObj => {
          if (moment(logObj.date).isBefore(data.to)) {
            return logObj
          }
      });
    }
    if (filteredByDate !== undefined) {
      limited = filteredByDate.slice(0, data.limit);
      count = limited.length;
    } else {
      limited = user.log.slice(0, data.limit);
      count = limited.length;
    }
    if(filteredByDate && limited) {      
      return cb({_id: user._id, username: user.username, count: count, log: limited});
    } else if (filteredByDate === undefined && limited) {
      return cb({_id: user._id, username: user.username, count: count, log: limited});
    } else {
      return cb(user);
    }

  });
}

module.exports = {
	createUser,
	getAllUsers,
	addExercise,
	getLogs
}