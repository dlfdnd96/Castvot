/*
 * 후보 검색창 ajax
 *
 */
const v = require('node-input-validator');
var escape = require('escape-html');


exports.search = function(req, res) {

    let validator = new v( req.body, {
        name: 'required|minLength:1|maxLength:32'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log("validator.errors : " + validator.errors)
            res.status(200).json({ status:false, message:validator.errors });
            return;
        }
        // XSS 방지
        var safe_name = escape(req.body.name);

        dbpool.getConnection(function (err, conn) {
            if (err) { // DB 연결 실패시
                console.log("Connection Error:", err);
                res.status(200).json({status: false, messages: '접속에 문제가 있습니다..2'});
                return;
            }
    // TODO : ↘ DB View 만들어지면 테이블 수정 필요.
            conn.query('SELECT * FROM bjc_v_main WHERE name = "' + safe_name + '"', function (err, rows) {
                if (err) {
                    conn.release();
                    console.log("search.js sql 에러");
                    console.log("main:sql:err:" + err)
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다.3" } )
                }
                conn.release();
                // 여기선 rowcount 체크 안함. 없으면 말구.
                console.log("dbcall:main:" + rows.length);

                // 후보목록을 가져오는 데 실패하면 즉, 검색결과가 없으면
                if (rows && rows instanceof Array && !rows.length) {
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                    return;
                }

                var realdata = JSON.stringify(rows);
                res.status(200).json({status: true, data: realdata});
                return;
            });
            //console.log(query);
        }); // end db query
    });
};