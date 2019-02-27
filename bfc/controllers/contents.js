let fs = require('fs');
let escape = require('escape-html');

exports.boardList = function(req, res) {

    dbpool.getConnection(function(err, conn) {
        if(err) { // DB 연결 실패시
            console.log("Connection Error:",err);
            res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
            return;
        }
        // TODO : ↘ bfc_season_number가 포함된 뷰로 수정.
        conn.query('SELECT * FROM test_board', function (err, rows) {
            if(err){
                conn.release();
                res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                return;
            }
            conn.release();
            // TODO: rank.....mysql에는 rank() 함수 없을껄;;;
            if (rows.length>0){  // DB에 있으면...
                // data={
                //     writer:rows[0].writer,
                //     password:rows[0].password,
                //     title:rows[0].title,
                //     contents:rows[0].contents,
                //     cdate:rows[0].cdate,
                //     mdate:rows[0].mdate,
                //     count:rows[0].count,
                //     del_yn:rows[0].del_yn
                // }
                // console.log("dbcall:boys:"+boykey);
                // cache.setex(rediskey, 15 ,JSON.stringify(data), cache.print); // 15초간 저장
                res.render('./bfc3_view/test/board',{items:rows});

            } else {
                console.log(rows);
                res.render('./bfc3_view/test/board',{title:"DB 없는 게시판", items: rows});
                // res.status(200).render('./error', { text:"해당 후보를 찾을 수 없습니다." } );
                return;
            }

        });
        //console.log(query);
    }); // end db query

}

exports.boardRegister = function(req, res) {

    // TODO: 인증체크
    // input validate *** DB에 넣을때는 maxLength와 type 항상 체크
    // https://www.npmjs.com/package/node-input-validator 참조
    // let validator = new v( req.body, {
    //     // 'product.id': 'required|integer',
    //     // user_name: 'required|minLength:2|maxLength:32',
    //     boy_name:'required|minLength:2|maxLength:32',
    //     boy_management:'minLength:2|maxLength:32',
    //     recommender:'minLength:1|maxLength:32',
    //     boy_birth_year:'minLength:4|maxLength:4',
    //     boy_birth_month:'minLength:1|maxLength:2',
    //     boy_birth_date:'minLength:1|maxLength:2',
    //     boy_blood_type:'minLength:1|maxLength:2',
    //     photokey1:'required|maxLength:36',
    //     photokey2:'maxLength:36',
    //     photokey3:'maxLength:36',
    //     photo1_src:'required|minLength:3',
    //     photo2_src:'minLength:3',
    //     photo3_src:'minLength:3',
    //     agree:'boolean',
    //     reason:'required|minLength:10'
    // });

    let mode = req.query.mode;

    let addNewTitle = req.body.addContentSubject;
    let addNewWriter = req.body.addContentWriter;
    let addNewPassword = req.body.addContentPassword;
    let addNewContent = req.body.addContents;

    let modTitle = req.body.modContentSubject;
    let modContent = req.body.modContents;
    let modPk = req.body.modPk;

    dbpool.getConnection(function(err, conn) {
        if(err) { // DB 연결 실패시
            console.log("Connection Error1:",err);
            res.status(200).json({ status:false, messages: '연결에 장에가 발생하였습니다.' });
            return;
        }

        let safeWriter = escape(req.body.addContentWriter);
        let safePassword = escape(req.body.addContentPassword);
        let safeTitle = escape(req.body.addContentSubject);
        let safeContents = escape(req.body.addContents);


        let query = conn.query('INSERT INTO test_board (writer, password, title, contents, count) VALUES(?, ?, ?, ?, 0)',
            [safeWriter, safePassword, safeTitle, safeContents],
            function(err, result, fields) {
                if(err){
                    console.log("Connection Error2:",err);
                    res.status(200).json({ status:false, messages: '등록에 장에가 발생하였습니다.' });
                    conn.release();
                    return;
                }
                res.status(200).json({ status:true });
                conn.release();
                console.log("INSERT:newboard:"+safeTitle);
            });
    });

    // validator.check().then(function (matched) {
    //     if (!matched) {
    //         console.log(validator.errors);
    //         res.status(200).json({ status:false, message:validator.errors });
    //         return;
    //     }
    //
    //     if (!checkuuid(req.body.photokey1)){ // 대부분 해킹시도임
    //         res.status(200).json({ status:false, messages: '메인 이미지형식이 맞지않습니다.' });
    //         return;
    //     }
    //     // 2,3번 이미지는 이상한거 들어오면 그냥 무시
    //     var safe_photokey2 = "", safe_photokey3 = "";
    //     if (checkuuid(req.body.photokey2)) {
    //         safe_photokey2 = req.body.photokey2;
    //     } else {
    //         console.log("ERROR:NOT_UUID:img2:"+req.body.photokey2);
    //     }
    //
    //     if (checkuuid(req.body.photokey3)){
    //         safe_photokey3 = req.body.photokey3;
    //     } else {
    //         console.log("ERROR:NOT_UUID:img3:"+req.body.photokey3);
    //     }
    //
    //     // XSS를 방지하기 위하여 text나 string은 항상 escape를 하도록 함
    //     var safe_boy_name = escape(req.body.boy_name);
    //     var safe_recommender = escape(req.body.recommender);
    //     var safe_boy_management = escape(req.body.boy_management);
    //     var safe_boy_birth_year = escape(req.body.boy_birth_year);
    //     var safe_boy_birth_month = escape(req.body.boy_birth_month);
    //     var safe_boy_birth_date = escape(req.body.boy_birth_date);
    //     var safe_boy_blood_type = escape(req.body.boy_blood_type);
    //     var safe_reason_safe = nl2br(escape(req.body.reason)); // text는 <br>을 추가.
    //     var safe_photo1_src = escape(req.body.photo1_src);
    //     var safe_photo2_src = escape(req.body.photo2_src);
    //     var safe_photo3_src = escape(req.body.photo3_src);
    //
    //     dbpool.getConnection(function(err, conn) {
    //         if(err) { // DB 연결 실패시
    //             console.log("Connection Error1:",err);
    //             res.status(200).json({ status:false, messages: '연결에 장에가 발생하였습니다.' });
    //             return;
    //         }
    //
    //         var query = conn.query('INSERT INTO bfc_boys (user_pk, recommender, boy_name, boy_management, boy_birth_year, boy_birth_month, boy_birth_date, boy_blood_type, public_agree, reason, photo1, photo2, photo3, photo1_src, photo2_src, photo3_src, bfc_season_number) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 3)',
    //             [req.user.uid, safe_recommender, safe_boy_name, safe_boy_management, safe_boy_birth_year, safe_boy_birth_month, safe_boy_birth_date, safe_boy_blood_type, req.body.public_agree, safe_reason_safe, req.body.photokey1, safe_photokey2, safe_photokey3, safe_photo1_src, safe_photo2_src, safe_photo3_src],
    //             function(err, result, fields) {
    //                 if(err){
    //                     console.log("Connection Error2:",err);
    //                     res.status(200).json({ status:false, messages: '등록에 장에가 발생하였습니다.' });
    //                     conn.release();
    //                     return;
    //                 }
    //                 res.status(200).json({ status:true });
    //                 conn.release();
    //                 console.log("INSERT:newboy:"+safe_boy_name);
    //             });
    //     });
    //
    // });

}

exports.boardDetail = function(req, res) {

    let contentPk = req.query.pk;

    // console.log(contentPk);

    dbpool.getConnection(function(err, conn) {

        if(err) {

            console.log("Connection Error1:", err);
            res.status(200).json({ status:false, messages: '연결에 장에가 발생하였습니다.' });
            return;

        }

        conn.query('SELECT * FROM test_board WHERE pk = ?', [contentPk],
            function(err, rows) {

                if(err){
                    conn.release();
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                    return;
                }

                conn.release();

                rows[0].count += 1;

                if (rows.length>0){  // DB에 있으면...

                    data={
                        pk: rows[0].pk,
                        writer: rows[0].writer,
                        password: rows[0].password,
                        title: rows[0].title,
                        contents: rows[0].contents,
                        cdate: rows[0].cdate,
                        mdate: rows[0].mdate,
                        count: rows[0].count,
                        del_yn: rows[0].del_yn
                    }
                    // console.log("dbcall:boys:"+boykey);
                    // cache.setex(rediskey, 15 ,JSON.stringify(data), cache.print); // 15초간 저장
                    // console.log(data);
                    res.render('./bfc3_view/test/boardDetail', {items: data});

                } else {

                    console.log(rows);
                    res.render('./bfc3_view/test/boardDetail',{items: rows});
                    // res.status(200).render('./error', { text:"해당 후보를 찾을 수 없습니다." } );
                    return;

                }

            })

    })

}

exports.checkPassword = function(req, res) {

    let pk = req.query.pk;

    dbpool.getConnection(function(err, conn) {

        if(err) {

            console.log("Connection Error1:", err);
            res.status(200).json({ status:false, messages: '연결에 장에가 발생하였습니다.' });
            return;

        }

        conn.query('SELECT password FROM test_board WHERE pk=?', [pk],
            function(err, rows) {

                if(err){
                    conn.release();
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                    return;
                }

                conn.release();

                if (rows.length>0){  // DB에 있으면...

                    res.send(rows[0].password);

                } else {

                    console.log(rows);
                    res.render('./bfc3_view/test/boardDetail',{items: rows});
                    // res.status(200).render('./error', { text:"해당 후보를 찾을 수 없습니다." } );
                    return;

                }

            })

    })

}