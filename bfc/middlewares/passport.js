var passport = require('passport');

var NaverStrategy = require('passport-naver').Strategy;
var KakaoStrategy = require('passport-kakao').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;



function insertPassport(accessToken, refreshToken, profile, done) {
    // console.log("insertPassport:", profile);

    if(profile !== undefined ) {
        // ON DUPLICATE KEY UPDATE 사용하여 최종 로그인시간 없데이트
        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error:",err);
                return done("DBError",profile)
            }
            // naver는 displayName값 없음
            if(profile.provider == "naver") profile.displayName=profile.id;
            conn.query('INSERT INTO bfc_passport_user (user_name, user_sns, user_identify_id, bfc_season_number) VALUES(?, ?, ?, 3) ON DUPLICATE KEY UPDATE mdate=NOW()', [profile.displayName, profile.provider, profile.id], function(err, result, fields) {
                if(err) {
                    console.log("insertPassportErr", err);
                    conn.release();
                    return done(err,profile); // 에러
                }
                /*
                TODO: INSERT ON DUPLICATE KEY UPDATE를 하면 UPDATE시에 insertId가 무조건 1로 튀어나올때고 있는듯 한데;;;
                If a table contains an AUTO_INCREMENT column and INSERT ... UPDATE inserts a row, the LAST_INSERT_ID() function returns the AUTO_INCREMENT value. If the statement updates a row instead, LAST_INSERT_ID() is not meaningful.
                */
                
                /*
                var userid=result.insertId;
                if(result.affectedRows == 1){ // INSERT 일때
                    console.log("LOGIN:NEW:" + userid + ":" + profile.provider + "/" + profile.displayName);
                } else { // UPDATE 일때
                    conn.query('SELECT pk FROM bfc_passport_user WHERE user_sns=? AND user_identify_id=? LIMIT 1', [profile.provider, profile.id], function(err, rows, fields) {
                        console.log("TEST:",rows);
                        if(err || rows.length < 1) {
                            console.log("selectPassportErr", err);
                            conn.release();
                            return done(err,profile); // 에러
                        }
                        userid=rows[0].pk;
                    });
                    console.log("LOGIN:RE:" + userid + ":" + profile.provider + "/" + profile.displayName);
                }
                */
                conn.release();
                return done(null, {uid:result.insertId, name:profile.displayName, sns:profile.provider, sns_id:profile.id});
            });
            // console.log(test.sql);
        });
    } else { // passport callback 실패할때
        console.log("PassportFail:",profile)
        done("PassportFail");
    }
};


module.exports = () => {

    passport.serializeUser(function (user, done) { // Strategy 성공 시 호출됨
        done(null, user);
    });
    passport.deserializeUser(function (user, done) { // 매개변수 user는 req.session.passport.user에 저장된 값
       done(null, user);
    });

    passport.use(new NaverStrategy(config.passport.naver, insertPassport));
    passport.use(new KakaoStrategy(config.passport.kakao, insertPassport));
    passport.use(new GoogleStrategy(config.passport.google, insertPassport));
    passport.use(new FacebookStrategy(config.passport.facebook, insertPassport));

}