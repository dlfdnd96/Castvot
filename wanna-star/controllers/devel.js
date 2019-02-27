/*
 * 개발 테스트용 controller
 * 
 * Author: Common
 * 
 * 해당 함수는 테스트 route.group 안에서만 사용하도록 !!!
 * 
 */

 /*
exports.genre_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre list');
};

exports.genre_list = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send('{"test":1}');
};

*/

// DB 사용 와꾸
exports.dbtest1 = function (req, res) {
    dbpool.getConnection(function(err, conn) {
        if(err) { // DB 연결 실패시
            console.log("Connection Error:",err);
            throw err;
        }
        var query = conn.query('select * from bjc_passport_user order by pk limit 5 ', function (err, rows) {
            if(err){
                conn.release();
                throw err;
            }
            // 여기서 할거 있으면 하고...
            conn.release();
            res.send(rows);
            console.log(rows);
        });
        //console.log(query);
    }); // end db query
};

// Redis set 와꾸
exports.redis_set = function (req, res) {
    var value = '캐시된 페이지롱~~~~~~';
    var key = "testpage";
    cache.set(key, value,function(err, data){
        if(err){
              console.log("cache:set:error:" + err);
              res.send("error " + err);
              return;
        }
        cache.expire(key,10); // 10초
        res.send(value);
        //console.log(value);
   }); // end Redis
};

// Redis get 와꾸
exports.redis_get = function (req, res) {
    cache.get("testpage",function(err, data){
        if(err){
              console.log("cache:get:error:" + err);
              res.send("error " + err);
              return;
        }
        //console.log("get:" + data);
        res.send(data);
   }); // end Redis
};

