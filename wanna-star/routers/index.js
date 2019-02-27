/*
 * 메인 index route
 *
 * Author: 공용
 *
 * TODO: response-time
 */
var express = require('express');
//var responseTime = require('response-time')
var router = express.Router();
//var schedule = require('node-schedule');

module.exports = function() {

    require('express-group-routes'); // 그룹 라우팅

    const basicAuth = require('express-basic-auth');

    // 패키지 및 헬퍼
    var utils = require('../helpers/utils');
    var passport = require('passport'); // 타사인증에 필요한 모듈

    // 미들웨어
    var auth = require('../middlewares/auth');
    //var mydb = require('../middlewares/db');

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // 컨트롤러
    // //var uploadController = require('../controllers/s3'); // 후보자 사진 등록 모듈
    var imguploadController = require('../controllers/imgupload'); // 이미지 업로드 컨트롤러
    var bjsController = require('../controllers/bjs'); // 후보자 상세페이지
    var searchController = require('../controllers/search'); // 후보목록 검색 컨트롤러
    var updateHotBjController = require('../controllers/updateHotBj'); // 메인페이지 HOT BJ 업데이트 컨트롤러
    var updateTodayBjController = require('../controllers/updateTodayBj'); // 메인페이지 TODAY BJ 업데이트 컨트롤러
    var updateNewBjController = require('../controllers/updateNewBj'); // 메인페이지 NEW BJ 업데이트 컨트롤러
    var updateBjlistController = require('../controllers/updateBjlist'); // 후보목록 페이지 업데이트 컨트롤러

    var newbj_selfController = require('../controllers/newbj_self'); // 후보자 등록 - 본인추천
    var newbj_othersController = require('../controllers/newbj_others'); // 후보자 등록 - 타인추천

    router.use(passport.initialize()); // passport(인증 모듈)를 초기화하는 미들웨어
    router.use(passport.session()); // 현재 세션 ID을 deserialized user 객체로 변경하는 미들웨어
    //router.use(passport.authenticate('session'));
    require('../middlewares/passport.js')(passport);
    //router.use('/login',  require('../middlewares/passport.js'));

    // view에 사용될 전역변수
    router.use(function (req, res, next) {
        res.locals.remoteip = res.ip;
        res.locals.main_max = config.main_max; // 메인에서 뿌려줄 최대 후보자수
        res.locals.is_login = req.isAuthenticated(); // 로그인 되어있는지
        res.locals.username = req.isAuthenticated() ? req.user.name : undefined;
        /*
        cache.get("countdown",function(err, data){
            console.log("InitCountdown:"+data);
            res.locals.countdown = JSON.parse(data);
            next();
        });
        */
        next();

    });

    // 접속 테스트 로그
    router.use(function(req, res, next) {
        //console.log("Cookies :  ", req.cookies);
        console.log("ACCESS:" + req.ip, req.method, req.originalUrl, typeof req.user !== undefined ? JSON.stringify(req.user) : "");
        next();
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // member 관련

    // SNS Login
    router.get('/login/:mode', function (req, res) {
        console.log("TryLogin:"+req.ip+":"+req.user);

        // TODO: 9/14일 지울것!!!
        // 이전에 ttl없이 발급된 connect.sid 지움
        if ( typeof req.cookies['connect.sid'] !== undefined ) res.clearCookie('connect.sid');
        (req.isAuthenticated()) && (res.redirect('/newbj/' + req.params.mode)) || (
            res.render('./member/login_form',{title:"로그인"})
        );
    });
    router.group("/login/auth", function(router) {
        // TODO: login_success_uri는 login시 redir값 받아서 처리
        let login_success_self_uri = '/newbj/self';
        let login_failure_uri = '/login';
        let login_success_others_uri = '/newbj/others';

        router.get('/naver', function(req, res, next) {
            passport.authenticate('naver')(req, res, next);
        });
        router.get('/naver/callback', function(req, res, next) {
            if(isSelf) {
                passport.authenticate('naver', {
                    successRedirect: login_success_self_uri, failureRedirect: login_failure_uri
                })(req, res, next);
            } else {
                passport.authenticate('naver', {
                    successRedirect: login_success_others_uri, failureRedirect: login_failure_uri
                })(req, res, next);
            }
        });
        router.get('/kakao', function(req, res, next) {
            passport.authenticate('kakao')(req, res, next);
        });
        router.get('/kakao/callback', function(req, res, next) {
            if(isSelf) {
                passport.authenticate('kakao', {
                    successRedirect: login_success_self_uri, failureRedirect: login_failure_uri
                })(req, res, next);
            } else {
                passport.authenticate('kakao', {
                    successRedirect: login_success_others_uri, failureRedirect: login_failure_uri
                })(req, res, next);
            }
        });
        router.get('/google', function(req, res, next) {
            passport.authenticate('google',{
                scope: 'https://www.googleapis.com/auth/plus.login'
            })(req, res, next);
        });
        router.get('/google/callback', function(req, res, next) {
            if(isSelf) {
                passport.authenticate('google', {
                    successRedirect: login_success_self_uri
                })(req, res, next);
            } else {
                passport.authenticate('google', {
                    successRedirect: login_success_others_uri
                })(req, res, next);
            }
        });
        router.get('/facebook', function(req, res, next) {
            passport.authenticate('facebook', {
                scope: ['public_profile', 'email']
            })(req, res, next);
        });
        router.get('/facebook/callback', function(req, res, next) {
            if(isSelf) {
                passport.authenticate('facebook', {
                    successRedirect: login_success_self_uri
                })(req, res, next);
            } else {
                passport.authenticate('facebook', {
                    successRedirect: login_success_others_uri
                })(req, res, next);
            }
        });
    });

    // 로그아웃
    router.get('/logout', function (req, res) {
        // 로그인 세션 있으면 지움
        if(req.user) req.session.destroy();
        res.redirect('/');
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // Ajax
    // TODO: 향후 함수로 모두 뺄것
    router.group("/ajax", function(router) {
        // FIXME: 임시로 풀어놈.
        //router.use(auth.authCheck); // 인증확인
        // TODO: 인증에러시 json으로 출력
        router.post('/imgupload',imguploadController.UploadImages); // 이미지 업로드
        router.post('/search', searchController.search); // 후보목록 검색
        router.get('/update_hotbj', updateHotBjController.updateHotBj); // 메인페이지 HOT BJ 업데이트
        router.get('/update_todaybj', updateTodayBjController.updateTodayBj); // 메인페이지 TODAY BJ 업데이트
        router.get('/update_newbj', updateNewBjController.updateNewBj); // 메인페이지 NEW BJ 업데이트
        router.get('/update_bjlist', updateBjlistController.updateBjlist); // 후보목록 페이지 업데이트
        router.post('/newbj/self', newbj_selfController.newbjProcessing); // 후보등록 - 본인추천
        router.post('/newbj/others', newbj_othersController.newbjProcessing); // 후보등록 - 타인추천
    });


    ////////////////////////////////////////////////////////////////////////////////////////////////
    // 시즌2 메인페이지

    router.get('/', function (req, res) {
        cache.get("maintenance",function(err, data){

            if(err){
                console.log("cache:get:error:" + err);
                res.status(200).render('./error', { text:"접속에 문제가 있습니다." } )
                return;
            }

            if(data === null){ // 캐쉬 없을때
                res.render('./main',{title:"홈"});;
                return;
            }
            res.render('./preparing',{title:"준비중",text:data});
        });
    });


    // 후보자 상세 페이지
    router.group('/bjs', function(router){
        router.get('/:bj_id', bjsController.bjDetail); // 후보자상세보기
        // router.get('/:boyId/edit', boysController_bfc.boyEditForm);
        // 후보자수정요청
        //router.get('/:boyId/qrcode', function (req, res) { res.render('./preparing',{title:"QR코드"}); });
    });

    // support
    router.group('/support', function(router){
        router.get('/company', function (req, res) { res.render('./support/company',{title:"회사소개"}); });
        router.get('/policy', function (req, res) { res.render('./support/policy',{title:"이용약관"}); });
        router.get('/privacy', function (req, res) { res.render('./support/privacy',{title:"개인정보보호수집이용동의"}); });
        router.get('/youth', function (req, res) { res.render('./support/youth',{title:"청소년보호정책"}); });
        router.get('/nomail', function (req, res) { res.render('./support/nomail',{title:"이메일수집금지정책"}); });
    });

    // notice
    router.group("/notice", function(router){
        router.get('/', function (req, res) {
            res.render('./notice/list', {title:"공지사항"});
        });
        router.get('/1', function (req, res) {
            res.render('./notice/detail',{title:"공지사항"});
        });
        router.get('/2', function (req, res) {
            res.render('./notice/detail2',{title:"공지사항"});
        });
        router.get('/3', function (req, res) {
            res.render('./notice/detail3',{title:"공지사항"});
        });
    });

    // 후보추천
    router.group("/newbj/:mode", function(router) {
        router.use(auth.authCheckSelf); // 인증확인
        router.get("/", function(req, res) {
            let urlSplit = req.originalUrl;
            let splitString = urlSplit.split("/");
            (splitString[2] === "self") ? (res.render('./newbj/newbj_form_self', {title:"후보자등록"})) : (
                (res.render('./newbj/newbj_form_others', {title:"후보자등록"}))
            );
        });
    });

    // 후보목록
    router.get("/bjlist", function(req, res){
        res.render('./bjlist/bjlist', {title: "후보목록"});
    });


    // found/notfound
    router.get('/found', function(req, res){
        res.render('./found', {title: "found"});
    });

    router.get('/notfound', function(req, res){
        res.render('./notfound', {title: "notfound"});
    });


    // partners
    router.get('/partners', function(req, res){
        res.render('./partners', {title: "제휴사"});
    });

    // gallery 갤러리
    router.get('/gallery', function(req, res){
        res.render('./gallery/gallery', {title: "갤러리"});
    });

    return router;
}
