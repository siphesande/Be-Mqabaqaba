// var getChallenges = require ('../data/challenges');

exports.showChallenges = function (req, res, next) {
        var id = req.params.userID,
            context = {};

        req.getConnection(function (err, connection) {
                connection.query("SELECT * FROM users WHERE id = ?", id, function (err, result) {
                        if (err) return next(err);
                        console.log(result);
                        var userName = result[0].name;
                        context.user = userName;
                        var status = result[0].status;

                        var resultRow = result[0];

                        var inactiveUser = resultRow.completed === 0,
                            activeUser = resultRow.completed > 0,

                            busyUser = resultRow.status === 1;
                       var  activeNotBusyUser = activeUser && !busyUser,
                            inactiveNotBusyUser = inactiveUser && !busyUser;

                        if (busyUser) {

                            connection.query("SELECT * FROM user_challenges WHERE user_id = ?", id, function (err, result) {
                                if (err) return next(err);
                                context = {
                                    no_challenges: result.length === 0,
                                    userID: id,
                                    user: userName
                                };

                                if (result.length > 0) {
                                    context.challenges = result[0];
                                    console.log("this is result", result);
                                    var date = result[0].date,
                                        type = result[0].challenge_id,
                                        challenges = [{
                                            id: 1,
                                            description: 'Go for a run and take a picture of something that inspires you. <br> <em>Restrictions: distance: <strong>1km</strong>, time limit: <strong>10 minutes!</strong></em>',
                                            type_id: 1,
                                            time_limit: 10,
                                            distance: 1000
                                        }, {
                                            id: 2,
                                            description: 'Take a new friend out for coffee! <br> <em>No restrictions</em>',
                                            type_id: 2,
                                            time_limit: 0,
                                            distance: 0
                                        }, {
                                            id: 3,
                                            description: 'Make a healthy home-made snack and share with 3 friends! <br> <em>Restrictions: distance: <strong>500m</strong>, time limit: <strong>10 minutes!</strong></em>',
                                            type_id: 3,
                                            time_limit: 10,
                                            distance: 500
                                        }];

                                    var details = challenges.find(function (a) {
                                        // console.log(type);
                                        return a.type_id === type;
                                    });

                                    // console.log("This is details", details);
                                    context.challenges.day = date.getDay() + 1,
                                        context.challenges.month = date.getMonth() + 1,
                                        context.challenges.year = date.getFullYear(),
                                        timeArray = result[0].time.split(":");

                                    context.challenges.hour = timeArray[0],
                                        context.challenges.minute = timeArray[1];
                                    // console.log("This is challenges", context.challenges);

                                    context.challenges.message = details.description;
                                }

                                // var current="Time's up!";        //—>enter what you want the script to display when the target date and time are reached, limit to 20 characters
                                // var year=2016;        //—>Enter the count down target date YEAR
                                // var month=5;          //—>Enter the count down target date MONTH
                                // var day=21;           //—>Enter the count down target date DAY
                                // var hour=18;          //—>Enter the count down target date HOUR (24 hour clock)
                                // var minute=38;


                                res.render("user-home", context);
                            });
                            ///countdown ends
                        } else if (activeNotBusyUser) {

                            context.completed = result[0];
                            return res.render('user-home', context);
                        } else if (inactiveNotBusyUser) {
                          connection.query("SELECT * FROM user_challenges WHERE user_id = ?", id, function (err, result) {
                              if (err) return next(err);
                              context = {
                                  no_challenges: result.length === 0,
                                  userID: id,
                                  user: userName
                              };
                            res.render('user-home', context);
                        });
                }
        });
      });
    };

        exports.addChallenge = function (req, res, next) {
            var id = req.params.userID,
                type = req.body.type,
                timeArray = req.body.time.split(":"),
                dateNow = new Date();
            // console.log(timeArray);
            var challenge_hour = timeArray[0],
                challenge_minute = timeArray[1];

            var day = dateNow.getDay() + 1,
                month = dateNow.getMonth(),
                year = dateNow.getFullYear();

            var date = new Date(year, month, day),
                challenge_time = new Date(year, month, day, challenge_hour, challenge_minute);
            // console.log(year, month, day, challenge_hour, challenge_minute);
            // console.log(challenge_time);

            var input = {
                user_id: id,
                challenge_id: type,
                date: date,
                time: challenge_time,
                recurring: 0
            }
            req.getConnection(function (err, connection) {
                connection.query("DELETE FROM user_challenges WHERE user_id = ?", id, function (err, result) {
                    if (err) return next(err);
                    connection.query("INSERT INTO user_challenges SET ?", input, function (err, result) {
                        if (err) return next(err);

                        connection.query("UPDATE users SET status = 1 WHERE id = ?", id, function (err, result) {
                            if (err) return next(err);
                            res.redirect('/user/' + id);
                        });
                    });
                });
            });
        };

        exports.updateStatus = function (req, res, next) {
            var id = req.params.userID,
                context;

            req.getConnection(function (err, connection) {
                connection.query("SELECT * FROM users WHERE id = ?", id, function (err, result) {
                    if (err) return next(err);
                    var input = {
                        points: result[0].points + 100,
                        completed: result[0].completed + 1,
                        status: 0
                    };

                    console.log("got user");

                    connection.query("UPDATE users SET ? WHERE id = ?", [input, id], function (err, result) {
                        if (err) return next(err);
                        console.log("user updated!");
                        res.redirect('/user/' + id);
                    });
                });
            });
        };

        exports.cancel = function (req, res, next) {
            var id = req.params.userID;
            var input = {
                          status: 0
            };
            req.getConnection(function (err, connection) {
            connection.query("UPDATE users SET ? WHERE id = ?", [input, id], function (err, result) {
                if (err) return next(err);
                console.log("user updated!");
                res.redirect('/user/' + id);
        });
      });
      };
