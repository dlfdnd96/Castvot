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

    // 컨트롤러
    //var uploadController = require('../controllers/s3'); // 후보자 사진 등록 모듈
    var imguploadController = require('../controllers/imgupload'); // 이미지 업로드 컨트롤러
    var boysController_bfc = require('../controllers/boys_bfc'); // 시즌2, 3 후보자 상세페이지
    var newboy_bfcController = require('../controllers/newboy_bfc'); // 시즌2, 3 후보자 등록
    var boylistController = require('../controllers/boylist'); // 시즌2, 3 후보목록 페이지 업데이트
    var searchController = require('../controllers/search'); // 시즌2, 3 후보목록 검색 컨트롤러

    let boardController = require('../controllers/contents'); // 게시판 컨트롤러 테스트 용도

    router.use(passport.initialize()); // passport(인증 모듈)를 초기화하는 미들웨어
    router.use(passport.session()); // 현재 세션 ID을 deserialized user 객체로 변경하는 미들웨어
    //router.use(passport.authenticate('session'));
    require('../middlewares/passport.js')(passport)
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


    ////////////////////////////////////////////////////////////////////////
    // member 관련

    router.get('/bfc3/login', function (req, res) {
        console.log("TryLogin:"+req.ip+":"+req.user);

        // TODO: 9/14일 지울것!!!
        // 이전에 ttl없이 발급된 connect.sid 지움
        if ( typeof req.cookies['connect.sid'] !== undefined ) res.clearCookie('connect.sid');
        if(req.isAuthenticated()) {
            res.redirect('/bfc3/newboy_bfc'); // 로그인 되어있으면 redirect 처리
        } else {
            res.render('./bfc3_view/member/login_form',{title:"로그인"});
        }
    });

    router.group("/bfc3/login/auth", function(router) {
        // TODO: login_success_uri는 login시 redir값 받아서 처리
        var login_success_uri = '/bfc3/newboy_bfc';
        var login_failure_uri = '/bfc3/login';

        router.get('/naver', passport.authenticate('naver'));
        router.get('/naver/callback', passport.authenticate('naver', { successRedirect: login_success_uri, failureRedirect: login_failure_uri} ));
        router.get('/kakao', passport.authenticate('kakao'));
        router.get('/kakao/callback', passport.authenticate('kakao', { successRedirect: login_success_uri, failureRedirect: login_failure_uri} ));
        router.get('/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
        router.get('/google/callback', passport.authenticate('google', { successRedirect: login_success_uri, failureRedirect: login_failure_uri} ));
        router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}));
        //router.get('/facebook', passport.authenticate('facebook'));
        router.get('/facebook/callback', passport.authenticate('facebook', { successRedirect: login_success_uri, failureRedirect: login_failure_uri} ));
    });


    // 로그아웃
    router.get('/logout', function (req, res) {
        // 로그인 세션 있으면 지움
        if(req.user) req.session.destroy();
        res.redirect('/bfc3');
    });


    ////////////////////////////////////////////////////////////////////////
    // Ajax
    // TODO: 향후 함수로 모두 뺄것
    router.group("/ajax", function(router) {
        // FIXME: 임시로 풀어놈.
        //router.use(auth.authCheck); // 인증확인
        // TODO: 인증에러시 json으로 출력
        router.post('/newboy_bfc', newboy_bfcController.newboyProcessing); // 후보추천 - 후보자등록완료
        router.post('/imgupload',imguploadController.UploadImages); // 이미지 업로드
        router.get('/update_boylist', boylistController.updateBoylist); // 메인페이지, 후보목록 페이지 업데이트
        router.post('/search', searchController.search); // 후보목록 검색
        router.get('/a',function(req,res){
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            var infoObj = {
                "name":"John",
                "age":"23",
                "birth":"1995.02.13",
                "location":"Seoul"
            }
            var infoStr = JSON.stringify(infoObj);
            res.send(infoStr);

        });
    });


    ////////////////////////////////////////////////////////////////////////
    // 시즌3 메인페이지

    router.get('/', function(req, res){
        res.redirect('/bfc3');
    });

    router.group("/bfc3",function(router){
        router.get('/',function(req,res){
            cache.get("maintenance",function(err, data){

                if(err){
                    console.log("cache:get:error:" + err);
                    res.status(200).render('./bfc3_view/error', { text:"접속에 문제가 있습니다." } )
                    return;
                }

                if(data === null){ // 캐쉬 없을때
                    res.render('./bfc3_view/main');
                    return;
                }
                res.render('./bfc3_view/preparing',{title:"준비중",text:data});
            });
        });

        // 후보자페이지
        router.group("/boys", function(router) {
            router.get('/:boyId', boysController_bfc.boyDetail); // 후보자상세보기
            // router.get('/:boyId/edit', boysController_bfc.boyEditForm);
            // 후보자수정요청
            //router.get('/:boyId/qrcode', function (req, res) { res.render('./preparing',{title:"QR코드"}); });
        });

        // 보팅어워즈
        router.get('/prize', function (req, res) { res.render('./bfc3_view/prize',{title:"보팅 어워드"}); });

        // support
        router.group("/support", function(router) {
            router.get('/companyinfo', function (req, res) { res.render('./bfc3_view/support/companyinfo',{title:"회사소개"}); });
            router.get('/policy', function (req, res) { res.render('./bfc3_view/support/policy',{title:"이용약관"}); });
            router.get('/privacy', function (req, res) { res.render('./bfc3_view/support/privacy',{title:"개인정보보호수집이용동의"}); });
            router.get('/youth', function (req, res) { res.render('./bfc3_view/support/youth',{title:"청소년보호정책"}); });
            router.get('/nomail', function (req, res) { res.render('./bfc3_view/support/nomail',{title:"이메일수집금지정책"}); });
        });

        // notice
        router.group("/notice", function(router){
            router.get('/', function (req, res) { res.render('./bfc3_view/notice/list', {title:"공지사항"}); });
            router.get('/1', function (req, res) { res.render('./bfc3_view/notice/detail',{title:"공지사항"}); });
            router.get('/2', function (req, res) { res.render('./bfc3_view/notice/detail2',{title:"공지사항"}); });
            router.get('/3', function (req, res) { res.render('./bfc3_view/notice/detail3',{title:"공지사항"}); });
            router.get('/4', function (req, res) { res.render('./bfc3_view/notice/detail4',{title:"공지사항"}); });
        });

        // 후보추천
        router.group("/newboy_bfc", function(router) {
            router.use(auth.authCheck); // 인증확인
            router.get("/", function(req, res) {
                res.render('./bfc3_view/newboy/newboy_form', {title:"후보자등록"});
            });
        });

        // 후보목록
        router.get("/boylist", function(req, res){
            res.render('./bfc3_view/boylist/boylist', {title: "후보목록"});
        });

    });

    // end of 시즌3 메인페이지


    ////////////////////////////////////////////////////////////////////////
    // 테스트 용도
    router.group("/test342", function(router) {
        var devController = require('../controllers/devel');
        //router.use(auth.authCheck); // 인증확인
        router.use(basicAuth(config.basic_auth));
        //router.use(auth.devOnly); // 개발자IP만 사용가능
        router.get('/', function (req, res) { res.render('./main',{title:"홈"}); });
        //router.get('/upload',  function (req, res) { res.render('./devel/imgupload',{title:"이미지 업로드 테스트"}); });
        router.get('/500test', function (req, res) { res.render('.xxxx',{title:"로그인"}); });
        router.get('/gvar', function (req, res) { res.send("env:" + config.env); });
        router.get('/session', function (req, res) { res.send(dumpobj(req.user)); });
        router.get('/dbtest1', devController.dbtest1);
        router.get('/redisset', devController.redis_set);
        router.get('/redisget', devController.redis_get);
    });

    /* 게시판 라우팅 테스트 */
    router.get('/boards', boardController.boardList);
    router.post('/boards', boardController.boardRegister);
    router.get('/boards/view', boardController.boardDetail);
    router.get('/boards/password', boardController.checkPassword);

    return router;
}
