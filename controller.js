const model = require('./model');
const moment = require('moment');

module.exports = {

	createUser: (req, res) => {
		const username = req.body.username;
		model.createUser(username, (dbRes, code) => {
			// console.log(`dbRes ${dbRes}`)
			// res.status.code.send(dbRes);
			res.send(dbRes)
		})
	},

	getAllUsers: (req, res) => {
		model.getAllUsers((dbRes, code) => {
			// console.log(`dbRes ${dbRes}`)
			res.send(dbRes);
		})
	},

	addExercise: (req, res) => {
	  const id = req.body.userId;
	  const des = req.body.description;
	  const dur = req.body.duration;
	  let date = req.body.date;
	  // validate Date input
	  if (date === '') {
	    let newDate = Date.now();
	    date =  moment(newDate).format('YYYY-MM-DD');
	  } else if (!moment(req.body.date, 'YYYY-MM-DD',true).isValid()) {
	    res.json(`${date} is an invalid date. Please enter a valid date in the format YYYY-MM-DD`);
	    return;
	  }
		const userData = {des, dur, date}

		model.addExercise(id, userData, (dbRes, code) => {
			res.send(dbRes);
		})
	},

	getUserLog: (req, res) => {
	  let userId = req.query.userId;
	  let fromParam = req.query.from;
	  let to = req.query.to;
	  let limit = req.query.limit;

	  const data = { userId, fromParam, to, limit }
		model.getLogs(data, (dbRes, code) => {
			res.send(dbRes);
		})
	}

}