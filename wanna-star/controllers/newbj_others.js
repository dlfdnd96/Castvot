/*
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
 * table : bfc_boys
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
exports.newbjProcessing = function (req, res) {

    // TODO: 인증체크
    // input validate *** DB에 넣을때는 maxLength와 type 항상 체크
    // https://www.npmjs.com/package/node-input-validator 참조
    let validator = new v( req.body, {
        bj_name:'required|maxLength:36',
        bj_contents: 'required|minLength:2',
        bj_active_area: 'required|minLength:2',
        introduce:'required|minLength:10',
        photokey1:'required|maxLength:36',
        photokey2:'maxLength:36',
        photokey3:'maxLength:36',
        photokey4:'maxLength:36',
        photo_src1:'required|minLength:3|maxLength:300',
        photo_src2:'maxLength:300',
        photo_src3:'maxLength:300',
        photo_src4:'maxLength:300',
        channel1:'required|maxLength:300',
        channel2:'maxLength:300',
        channel3:'maxLength:300',
        fanclub:'maxLength:300',
        video1:'required|maxLength:300',
        video2:'required|maxLength:300',
        recommender:'required|minLength:2',
        userEmail:'required|minLength:2',
        userMPhone:'required|minLength:2',
        userPhone:'minLength:2'
    });

    validator.check().then(function (matched) {
        if (!matched) {
            console.log(validator.errors)
            res.status(200).json({ status:false, message:validator.errors });
            return;
        }

        if (!checkuuid(req.body.photokey1)){ // 대부분 해킹시도임
            res.status(200).json({ status:false, messages: '메인 이미지형식이 맞지않습니다.' });
            return;
        }
        // 2,3번 이미지는 이상한거 들어오면 그냥 무시
        var safe_photokey2 = "", safe_photokey3 = "", safe_photokey4 = "";
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

        if (checkuuid(req.body.photokey4)){
            safe_photokey4 = req.body.photokey4;
        } else {
            console.log("ERROR:NOT_UUID:img4:"+req.body.photokey4);
        }

        // XSS를 방지하기 위하여 text나 string은 항상 escape를 하도록 함
        var safe_bj_name = escape(req.body.bj_name);
        var safe_reason_safe = nl2br(escape(req.body.introduce)); // text는 <br>을 추가.
        var safe_photo1_src = escape(req.body.photo_src1);
        var safe_photo2_src = escape(req.body.photo_src2);
        var safe_photo3_src = escape(req.body.photo_src3);
        var safe_photo4_src = escape(req.body.photo_src4);
        var safe_bj_contents = escape(req.body.bj_contents);
        var safe_bj_active_area = escape(req.body.bj_active_area);
        var safe_bjEmail = escape(req.body.bjEmail);
        var safe_channel1 = escape(req.body.channel1);
        var safe_channel2 = escape(req.body.channel2);
        var safe_channel3 = escape(req.body.channel3);
        var safe_fanclub = escape(req.body.fanclub);
        var safe_video1 = escape(req.body.video1);
        var safe_video2 = escape(req.body.video2);
        var safe_recommender = escape(req.body.recommender);
        var safe_userEmail = escape(req.body.userEmail);
        var safe_userMPhone = escape(req.body.userMPhone);
        var safe_userPhone = escape(req.body.userPhone);

        if (typeof req.body.photo_src3 === 'undefined') { safe_photo3_src = null }
        if (typeof req.body.photo_src4 === 'undefined') { safe_photo4_src = null }
        if (typeof req.body.channel2 === 'undefined') { safe_channel2 = null }
        if (typeof req.body.channel3 === 'undefined') { safe_channel3 = null }
        if (typeof req.body.userPhone === 'undefined') { safe_userPhone = null }

        dbpool.getConnection(function(err, conn) {
            if(err) { // DB 연결 실패시
                console.log("Connection Error1:",err);
                res.status(200).json({ status:false, messages: '연결에 장에가 발생하였습니다.' });
                return;
            }

            var query = conn.query('INSERT INTO bjc_bjs (user_pk, bj_name, bj_contents, bj_active_area, bj_email, bj_introduce, bj_photo1, bj_photo2, bj_photo3, bj_photo4, bj_photo1_src, bj_photo2_src, bj_photo3_src, bj_photo4_src, bj_channel1, bj_channel2, bj_channel3, bj_fanclub, bj_hot_video_src1, bj_hot_video_src2, rec_name, rec_email, rec_contact_num1, rec_contact_num2, self_yn) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
                [req.user.uid, safe_bj_name, safe_bj_contents, safe_bj_active_area,safe_bjEmail, safe_reason_safe, req.body.photokey1, safe_photokey2, safe_photokey3, safe_photokey4, safe_photo1_src, safe_photo2_src, safe_photo3_src, safe_photo4_src, safe_channel1, safe_channel2, safe_channel3, safe_fanclub, safe_video1, safe_video2, safe_recommender, safe_userEmail, safe_userMPhone, safe_userPhone],
                function(err, result, fields) {
                    if(err){
                        console.log("Connection Error2:",err);
                        res.status(200).json({ status:false, messages: '등록에 장에가 발생하였습니다.' });
                        conn.release();
                        return;
                    }
                    res.status(200).json({ status:true });
                    conn.release();
                    console.log("INSERT:newbj:"+safe_bj_name);
                });
        });

    });

};
