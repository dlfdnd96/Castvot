/*
 * 메인페이지 업데이트 ajax
 * 
 * Author: dubhe@castvot.com
 * 
 */

//var utils = require('../helpers/utils'); 

exports.updateBjlist = function (req, res) {

    // TODO: redis 붙이고 업데이트는 admin에서 처리하고 여기선 redis만 사용 예정

    var rediskey = config.cachekey.main;
    cache.get(rediskey,function(err, data){

        if(err){
            console.log("maincache:get:error:" + err);
            res.status(200).json({ status:false, messages: '접속에 문제가 있습니다..1' });
            return;
        }
        
        if(data === null){ // 캐쉬 없을때
            console.log("maincache:nohit:" + rediskey);

            dbpool.getConnection(function(err, conn) {
                if(err) { // DB 연결 실패시
                    console.log("Connection Error:",err);
                    res.status(200).json({ status:false, messages: '접속에 문제가 있습니다..2' });
                    return;
                }

                // TODO: ordey by를 amount 등으로 변경.
                conn.query('SELECT * FROM bjc_v_main ORDER BY total DESC, name LIMIT ?',[config.main_max], function (err, rows) {
                    if(err){
                        conn.release();
                        console.log("main:sql:err:"+err)
                        res.status(200).render('./error', { text:"접속에 문제가 있습니다.3" } )
                        return;
                    }
                    conn.release();
                    // 여기선 rowcount 체크 안함. 없으면 말구.

                    console.log("dbcall:main:"+rows.length);
                    var realdata=JSON.stringify(rows);
                    cache.setex(rediskey, 5 ,realdata, cache.print); // 15초간 저장
                    res.status(200).json({ status:true, data:realdata });
                    return;
                });
                //console.log(query);
            }); // end db query

        } else { // cached
            console.log("cache:hit:" + rediskey);
            res.status(200).json({ status:true, data:data });
            return;
        }
    
    }); // end Redis



};
