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
            console.log(result);
            context.user = result[0].name;

            res.render("user-home", context);
          });
        });
      });
};

exports.addChallenge = function (req, res, next) {
  var id = req.params.userID,
      type = req.body.type,
      time = req.body.time,
      date = Date.now();

  connection.query("INSERT INTO user_challenges (user_id, challenge_type, date, time) VALUES ?", [id, type,date, time], function(err, result){
    if (err) return next(err);
    res.redirect('/home/'+id);
  });
};
