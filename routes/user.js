exports.showChallenge = function(req, res, next) {
  var id = req.params.userID,
      context;

      req.getConnection(function(err, connection){
        connection.query("SELECT * from user_challenges WHERE user_id = ?", id, function(err, result){
          if (err) return next(err);
          context = {
                      no_challenges: result.length===0,
                      challenges: result.length>0,
                      userID: id
          };
          connection.query("SELECT * from users WHERE id = ?", id, function(err, result){
            if (err) return next(err);
            context.user = result[0].name;

            res.render("user-home", context);
          });
        });
      });
};

exports.addChallenge = function (req, res, next) {
  var id = req.params.userID,
      type = req.body.type,
      timeArray = req.body.time.split(":"),
      dateNow = new Date();
console.log(timeArray);
var challenge_hour = timeArray[0],
    challenge_minute = timeArray[1];

  var day = dateNow.getDay() + 1,
      month = dateNow.getMonth(),
      year = dateNow.getFullYear();

  var date = new Date(year,month,day),
      challenge_time = new Date(year, month, day, challenge_hour, challenge_minute);
  console.log(year, month, day, challenge_hour, challenge_minute);
  console.log(challenge_time);

var input = {
            user_id: id,
            challenge_id: type,
            date: date,
            time: challenge_time,
            recurring: 0
}
      req.getConnection(function(err, connection){
  connection.query("INSERT INTO user_challenges SET ?", input, function(err, result){
    if (err) return next(err);
    res.redirect('/user/'+id);
  });
});
};
