/*
 * 후보목록 페이지 업데이트 ajax
 */

exports.updateBoylist = function(req, res){

    var rediskey = config.cachekey.bfc3_main;
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

        // TODO : ↘ bfc_season_number가 포함된 뷰로 수정.
                conn.query('SELECT * FROM bfc_v_main WHERE season_number = 3 ORDER BY total DESC, name',[config.main_max], function (err, rows) {
                // conn.query('SELECT * FROM bfc_v_main ORDER BY total DESC LIMIT ?',[config.main_max], function (err, rows) {
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
                    console.log("캐쉬 없을때: " + realdata);
                    res.status(200).json({ status:true, data:realdata });
                    return;
                });
                //console.log(query);
            }); // end db query

        } else { // cached
            console.log("cache:hit:" + rediskey);
            console.log("캐쉬 일때: " + data);
            res.status(200).json({ status:true, data:data });
            return;
        }

    }); // end Redis

};