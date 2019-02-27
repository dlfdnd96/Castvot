/*
 * 후보목록 페이지 업데이트 ajax
 */

exports.updateNewBj = function(req, res){

// TODO : ↘ 추후 레디스 키 업데이트 문의.
    var rediskey = config.cachekey.bfc2_main;
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

                let newBjIds = new Array;

                // ↘ bjc_bjs로부터 가장 최근에 승인된 bj의 pk를 최대 12개까지 저장하는 코드. (pk가 bjc_v_main에서 bj_id.)
                conn.query('SELECT * FROM bjc_bjs where status = \'ACTIVE\'', function(err, rows){
                    if(err){
                        conn.release();
                        console.log("main:sql:err:"+err);
                        res.status(200).render('./error', { text:"접속에 문제가 있습니다..3" } );
                        return;
                    }

                    let newestBj = rows;
                    let len;
                    let tmp;

                    if(rows.length > 12) len = 12;
                    else len = rows.length;

                    // ↘ Bubble Sort
                    for(let i = 0; i < len; i++){
                        for(let j = 0; j < len-i-1; j++){
                            if(newestBj[j].mdate > newestBj[j+1].mdate){
                                tmp = newestBj[j];
                                newestBj[j] = newestBj[j+1];
                                newestBj[j+1] = tmp;
                            }
                        }
                    }

                    for(let i = 0; i < len; i++){
                        newBjIds.push(newestBj[len-i-1].pk);
                    }

                    console.log("dbcall:main:"+rows.length);

                }); // end of conn.query(SELECT * FROM bjc_bjs...)

                // bjs_v_main에서 후보를 가져와서 가져온 newBjIds의 순서대로 return
                conn.query('SELECT * FROM bjc_v_main', function (err, rows) {
                    if(err){
                        conn.release();
                        console.log("main:sql:err:"+err)
                        res.status(200).render('./error', { text:"접속에 문제가 있습니다.3" } )
                        return;
                    }
                    conn.release();

                    let realdata = new Array;

                    for(let i = 0; i < newBjIds.length; i++){
                        for(let j = 0; j < newBjIds.length; j++){
                            if(newBjIds[i] == rows[j].bj_id){
                                realdata.push(rows[j]);
                                break;
                            }
                        }
                    }

                    realdata = JSON.stringify(realdata);
                    cache.setex(rediskey, 5 ,realdata, cache.print); // 15초간 저장
                    res.status(200).json({ status:true, data:realdata });
                    return;
                }); // end of conn.query(SELECT * FROM bjc_v_main...)

            }); // end db query

        } else { // cached
            console.log("cache:hit:" + rediskey);
            res.status(200).json({ status:true, data:data });
            return;
        }

    }); // end Redis

};