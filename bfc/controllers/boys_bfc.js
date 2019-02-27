/*
 * 후보자 페이지
 *
 * Author: dubhe@castvot.com
 *
 *
 */
const v = require('node-input-validator');
const imgPrefix = "https://img.castvot.com/files/bfc/";
const noImage = "https://img.castvot.com/img/unknown.jpg";


// TODO: 숫자로 pk로 받는데 uuid로 변경하는것이 좋을듯함
exports.boyDetail = function (req, res) {
    //console.log(req.params);
    let validator = new v( req.params, {
        // 'product.id': 'required|integer',
        boyId:'required|integer|min:1'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log(validator.errors)
            res.status(200).render('./error', { text:"비정상적인 접근입니다." } )
            return;
        }
        var boykey = req.params.boyId;
        // redis
        var rediskey = config.cachekey.boysPrefix+boykey;
        cache.get(rediskey,function(err, data){

            if(err){
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
        // TODO : ↘ bfc_season_number가 포함된 뷰로 수정.
                    conn.query('select * from bfc_v_detail where boyid=? AND season_number = 3',[boykey], function (err, rows) {
                        if(err){
                            conn.release();
                            res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                            return;
                        }
                        conn.release();
                        // TODO: rank.....mysql에는 rank() 함수 없을껄;;;
                        if (rows.length>0){  // DB에 있으면...
                            data={
                                boyname:rows[0].name,
                                snslink:rows[0].sns,
                                reason:rows[0].reason,
                                management:rows[0].management,
                                year:rows[0].year,
                                month:rows[0].month,
                                date:rows[0].date,
                                blood_type:rows[0].blood_type,
                                photo1:rows[0].photo1.length > 1 ? imgPrefix + rows[0].photo1 + "-large.jpg" : noImage,
                                photo2:rows[0].photo2.length > 1 ? imgPrefix + rows[0].photo2 + "-small.jpg" : noImage,
                                photo3:rows[0].photo3.length > 1 ? imgPrefix + rows[0].photo3 + "-small.jpg" : noImage,
                                photo1_src:rows[0].photo1_src ? rows[0].photo1_src : "",
                                photo2_src:rows[0].photo2_src ? rows[0].photo2_src : "",
                                photo3_src:rows[0].photo3_src ? rows[0].photo3_src : "",
                                author:rows[0].public_agree ? rows[0].author + " (" + rows[0].user_sns + ")": "비공개",
                                accounts:rows[0].accounts
                            }
                            console.log("dbcall:boys:"+boykey);
                            cache.setex(rediskey, 15 ,JSON.stringify(data), cache.print); // 15초간 저장
                            res.render('./bfc3_view/boys/boys_detail',{title:"후보상세", boyid:boykey, data:data});

                        } else {
                            res.status(200).render('./error', { text:"해당 후보를 찾을 수 없습니다." } )
                            return;
                        }

                    });
                    //console.log(query);
                }); // end db query

            } else {
                console.log("cache:hit:" + rediskey);
                res.render('./bfc3_view/boys/boys_detail',{title:"후보상세", boyid:boykey, data:JSON.parse(data)});
                return;
            }

            // 여기까지 올일 없을껄..
            return;
        }); // end Redis

    })

};

exports.boyEditForm = function (req, res) {
    //console.log(req.params);

    // TODO: 인증확인

    let validator = new v( req.params, {
        // 'product.id': 'required|integer',
        boyId:'required|integer|min:1'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log(validator.errors)
            res.status(200).render('./error', { text:"비정상적인 접근입니다." } )
            return;
        }
        var boykey = req.params.boyId;

        // TODO: DB 를 쓰자
        res.render('./boys/editboy',{title:"후보수정", boyid:boykey});

    })

};