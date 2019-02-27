/*
 * 국민남친선발대회2
 * 후보자등록
 *
 * Author: dubhe@castvot.com
 *
 */

//var utils = require('../helpers/utils');
const v = require('node-input-validator');
var checkuuid = require('uuid-validate');
var escape = require('escape-html');
var nl2br  = require('nl2br');

/*
 * newboy에서 POST로 넘어온 값 처리
 *
 * 업로드 파일은 /ajax/imgupload 에서 처리
 *
 * table : sc2_bfc_boys
 *
 * @param json으로 받음
 *
 *  photokey1 : 6ad9b0b4-25d1-4f43-9c80-d236d8daf461
 *
 * @response json
 *      message
 *      type
 *      status
 *
 */
exports.newboyProcessing = function (req, res) {

    // TODO: 인증체크
    // input validate *** DB에 넣을때는 maxLength와 type 항상 체크
    // https://www.npmjs.com/package/node-input-validator 참조
    let validator = new v( req.body, {
        // 'product.id': 'required|integer',
        // user_name: 'required|minLength:2|maxLength:32',
        boy_name:'required|minLength:2|maxLength:32',
        boy_management:'minLength:2|maxLength:32',
        recommender:'minLength:1|maxLength:32',
        boy_birth_year:'minLength:4|maxLength:4',
        boy_birth_month:'minLength:1|maxLength:2',
        boy_birth_date:'minLength:1|maxLength:2',
        boy_blood_type:'minLength:1|maxLength:2',
        photokey1:'required|maxLength:36',
        photokey2:'maxLength:36',
        photokey3:'maxLength:36',
        photo1_src:'required|minLength:3',
        photo2_src:'minLength:3',
        photo3_src:'minLength:3',
        agree:'boolean',
        reason:'required|minLength:10'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log(validator.errors);
            res.status(200).json({ status:false, message:validator.errors });
            return;
        }

        if (!checkuuid(req.body.photokey1)){ // 대부분 해킹시도임
            res.status(200).json({ status:false, messages: '메인 이미지형식이 맞지않습니다.' });
            return;
        }
        // 2,3번 이미지는 이상한거 들어오면 그냥 무시
        var safe_photokey2 = "", safe_photokey3 = "";
        if (checkuuid(req.body.photokey2)) {
            safe_photokey2 = req.body.photokey2;
        } else {
            console.log("ERROR:NOT_UUID:img2:"+req.body.photokey2);
        }

        if (checkuuid(req.body.photokey3)){
            safe_photokey3 = req.body.photokey3;
        } else {
            console.log("ERROR:NOT_UUID:img3:"+req.body.photokey3);
        }

        // XSS를 방지하기 위하여 text나 string은 항상 escape를 하도록 함
        var safe_boy_name = escape(req.body.boy_name);
        var safe_recommender = escape(req.body.recommender);
        var safe_boy_management = escape(req.body.boy_management);
        var safe_boy_birth_year = escape(req.body.boy_birth_year);
        var safe_boy_birth_month = escape(req.body.boy_birth_month);
        var safe_boy_birth_date = escape(req.body.boy_birth_date);
        var safe_boy_blood_type = escape(req.body.boy_blood_type);
        var safe_reason_safe = nl2br(escape(req.body.reason)); // text는 <br>을 추가.
        var safe_photo1_src = escape(req.body.photo1_src);
        var safe_photo2_src = escape(req.body.photo2_src);
        var safe_photo3_src = escape(req.body.photo3_src);

        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error1:",err);
                res.status(200).json({ status:false, messages: '연결에 장애가 발생하였습니다.' });
                return;
            }

            var query = conn.query('INSERT INTO bfc_boys (user_pk, recommender, boy_name, boy_management, boy_birth_year, boy_birth_month, boy_birth_date, boy_blood_type, public_agree, reason, photo1, photo2, photo3, photo1_src, photo2_src, photo3_src, bfc_season_number) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 3)',
                [req.user.uid, safe_recommender, safe_boy_name, safe_boy_management, safe_boy_birth_year, safe_boy_birth_month, safe_boy_birth_date, safe_boy_blood_type, req.body.public_agree, safe_reason_safe, req.body.photokey1, safe_photokey2, safe_photokey3, safe_photo1_src, safe_photo2_src, safe_photo3_src],
                function(err, result, fields) {
                    if(err){
                        console.log("Connection Error2:",err);
                        res.status(200).json({ status:false, messages: '등록에 장애가 발생하였습니다.' });
                        conn.release();
                        return;
                    }
                    res.status(200).json({ status:true });
                    conn.release();
                    console.log("INSERT:newboy:"+safe_boy_name);
                });
        });

    });

};
