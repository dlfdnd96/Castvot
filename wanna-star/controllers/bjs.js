/*
 * 후보자 페이지
 *
 * Author: dubhe@castvot.com
 *
 *
 */
const v = require('node-input-validator');
                        // TODO : ↘ s3에서 파일 저장 경로 수정하는지 확인하기.
const imgPrefix = "https://img.castvot.com/files/bfc/";
const noImage = "https://img.castvot.com/img/unknown.jpg";

// TODO: 숫자로 pk로 받는데 uuid로 변경하는것이 좋을듯함
exports.bjDetail = function (req, res) {
    //console.log(req.params);
    let validator = new v( req.params, {
        // 'product.id': 'required|integer',
        bj_id:'required|integer|min:1'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log(validator.errors);
            console.log("#### validator rejected");
            res.status(200).render('./error', { text:"비정상적인 접근입니다." } )
            return;
        }
        var bjkey = req.params.bj_id;
        console.log("#### bjkey : " + bjkey);

        // redis
// TODO : ↘ development.json 수정 후 같이 수정
        var rediskey = config.cachekey.boysPrefix+bjkey;
        cache.get(rediskey,function(err, data){

            if(err){
                console.log("#### redis error");
                console.log("cache:get:error:" + err);
                res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                return;
            }

            if(data === null){ // 캐쉬 없을때
                console.log("cache:nohit:" + rediskey);

                dbpool.getConnection(function(err, conn) {
                    if(err) { // DB 연결 실패시
                        console.log("Connection Error:",err);
                        res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                        return;
                    }


                    // conn.query("select ISNULL(photo1, 'isnull') from bjc_v_detail where bj_id = ?", [bjkey], function(err, rows){
                    //     if(err){
                    //
                    //         // if(typeof(rows[0].photo4) == undefined){
                    //         //     console.log("######## undefined detected")
                    //         // }
                    //         conn.release();
                    //         res.status(200).render('./error', { text:"접속에 문제가 있습니다." } );
                    //         return;
                    //     }
                    // });



                    conn.query('select * from bjc_v_detail where bj_id=?',[bjkey], function (err, rows) {
                        if(err){
                            conn.release();
                            res.status(200).render('./error', { text:"접속에 문제가 있습니다." } );
                            return;
                        }
                        conn.release();
                        // TODO: rank.....mysql에는 rank() 함수 없을껄;;;
                        if (rows.length>0){  // DB에 있으면...
                            data={
                                bjId:rows[0].bj_id,
                                name:rows[0].name,
                                contents:rows[0].contents,
                                repchannel:rows[0].active_area,
                                introduce:rows[0].introduce,
                                channel1:rows[0].channel1,
                                channel2:rows[0].channel2,
                                channel3:rows[0].channel3,
                                fanclub:rows[0].fanclub,
                                hotvideo1:rows[0].hot_video_src1,
                                hotvideo2:rows[0].hot_video_src2,
                                photo1:rows[0].photo1.length > 1 ? imgPrefix + rows[0].photo1 + "-large.jpg" : noImage,
                                photo2:rows[0].photo2.length > 1 ? imgPrefix + rows[0].photo2 + "-small.jpg" : noImage,
                                photo3:rows[0].photo3.length > 1 ? imgPrefix + rows[0].photo3 + "-small.jpg" : noImage,
                                photo4:rows[0].photo4.length > 1 ? imgPrefix + rows[0].photo4 + "-small.jpg" : noImage,
                                photo1_src:rows[0].photo1_src ? rows[0].photo1_src : "",
                                photo2_src:rows[0].photo2_src ? rows[0].photo2_src : "",
                                photo3_src:rows[0].photo3_src ? rows[0].photo3_src : "",
                                photo4_src:rows[0].photo4_src ? rows[0].photo4_src : "",
                                accounte:rows[0].accounts
                            };
                            console.log("dbcall:bjs:"+bjkey);
                            cache.setex(rediskey, 15 ,JSON.stringify(data), cache.print); // 15초간 저장
                            res.render('./bjs/bjs_detail',{title:"후보상세", bj_id:bjkey, data:data});

                        } else {
                            res.status(200).render('./error', { text:"해당 후보를 찾을 수 없습니다." } )
                            return;
                        }

                    });
                    //console.log(query);
                }); // end db query

            } else {
                console.log("cache:hit:" + rediskey);
                res.render('./bjs/bjs_detail',{title:"후보상세", bj_id:bjkey, data:JSON.parse(data)});
                return;
            }

            // 여기까지 올일 없을껄..
            return;
        }); // end Redis

    })

};

// ↘ 사용하지 않아서 주석처리.
// exports.boyEditForm = function (req, res) {
//     //console.log(req.params);
//
//     // TODO: 인증확인
//
//     let validator = new v( req.params, {
//         // 'product.id': 'required|integer',
//         bj_id:'required|integer|min:1'
//     });
//
//     validator.check().then(function (matched) {
//         if (!matched) {
//             console.log(validator.errors)
//             res.status(200).render('./error', { text:"비정상적인 접근입니다." } )
//             return;
//         }
//         var bjkey = req.params.bjId;
//
//         // TODO: DB 를 쓰자
//         res.render('./boys/editboy',{title:"후보수정", bjId:bjkey});
//
//     })
//
// };