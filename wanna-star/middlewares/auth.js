/*
 * 인증체크 미들웨어
 * 
 * Author: dubhe@castvot.com
 * 
 */
var utils = require('../helpers/utils');

// 세션 로그인 되었을때
exports.authCheckSelf = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        // TODO: redir
        let urlSplit = req.originalUrl;
        let splitString = urlSplit.split("/");
        console.log("RequireAuth:",req.ip, req.method, req.originalUrl);
        (splitString[2] === "self") && (isSelf = true) || (isSelf = false);
        res.redirect('/login/' + splitString[2]);
        return;
    }
};

// 개발자 IP만 ok 하는 미들웨어
exports.devOnly =function (req, res, next) {
    if (utils.checkDevIP(req.ip)) {
        console.log("allow_dev:" + req.ip + ":" + req.url);
        next();
    } else {
        console.log("block_dev:" + req.ip + ":" + req.url);
        // TODO: redir
       res.redirect("/");
    }
}
