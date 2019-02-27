/*
 *
 *  오늘 최다투표량을 저장하는 middleware.
 *
 */

const schedule = require('node-schedule');

exports.todayVoteJob = function(req, res, next){
    let rule = new schedule.RecurrenceRule();
    // 매 (rule.hour)시 (rule.minute)분 (rule.second)초에 실행되는 코드.
    rule.hour = 23;
    rule.minute = 59;
    rule.second = 59;

    let job = schedule.scheduleJob(rule, function(){
        console.log("#### It's 23:59:59.");

        let yes_value; // yesterday voting value 저장하는 변수.
        let len;

        // DB 연결 시작
        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error:",err);
                res.status(200).json({ status:false, messages: '접속에 문제가 있습니다..2' });
                return;
            }

            // bjc_v_main에서 bj_id, 투표량 데이터 가져옴
            conn.query('SELECT bj_id, total FROM bjc_v_main ORDER BY total DESC, name LIMIT ?',[config.main_max], function (err, rows) {
                if(err){
                    conn.release();
                    console.log("main:sql:err:"+err);
                    console.log("coin_data select err");
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다.3" } );
                    return;
                }

                console.log("dbcall:main:"+rows.length);
                var realdata = JSON.stringify(rows);
                len = rows.length;
                yes_value = JSON.parse(realdata);

                for(let i = 0; i < len; i++) {
                    if(yes_value[i].yes_total === undefined) {
                        yes_value[i].yes_total = 0;
                    }
                }

                return;
            }); // end of conn.query

            // 기존에 yes_total 컬럼에 저장된 데이터 삭제
            conn.query('DELETE FROM bjc_today_total', function (err, rows) {
                if(err){
                    conn.release();
                    console.log("main:sql:err:"+err);
                    console.log("delete err");
                    res.status(200).render('./error', { text:"접속에 문제가 있습니다.3" } );
                    return;
                }
                insertValues();
                return;
            }); // end of conn.query

            // 갱신된 total을 yes_total에 삽입
            function insertValues() {
                for (let i = 0; i < len; i++) {
                    conn.query('INSERT INTO bjc_today_total(yes_total, bj_id) VALUES(?, ?)',
                        [yes_value[i].yes_total, yes_value[i].bj_id],
                        function (err, result, fields) {
                            if (err) {
                                console.log("Connection Error2:", err);
                                console.log("insert err");
                                res.status(200).json({status: false, messages: '등록에 장에가 발생하였습니다.'});
                                conn.release();
                                return;
                            }
                            return;
                        }
                    ); // end of conn.query
                } // end of for
            } // end of insertValues()

            conn.release();
        }); // end of dbpool.getconnection()
    }) // end of schedule.scheduleJob
};