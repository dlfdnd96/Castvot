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
    // var newboyController = require('../controllers/newboy'); // 후보자 등록
    var imguploadController = require('../controllers/imgupload'); // 이미지 업로드 컨트롤러
    var updateController = require('../controllers/update'); // 페이지 업데이트컨트롤러
    // var boysController = require('../controllers/boys'); // 후보자 상세 컨트롤러
    var boysController_bfc2 = require('../controllers/boys_bfc2'); // 시즌2 후보자 상세페이지
    // var newboy2Controller = require('../controllers/newboy2'); // 시즌2 후보자 등록
    // var recommendController = require('../controllers/newboy2'); // 시즌2 admin용 후보자 등록
    var boylistController = require('../controllers/boylist_bfc2'); // 시즌2 후보목록 페이지 업데이트
    var searchController = require('../controllers/search'); // 시즌2 후보목록 검색 컨트롤러

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

    ///////////////////////////////////////////////////////////////////////////////////////////
    // 시즌1 메인인덱스
    // 임시로 막아놈

    router.get('/', function(req, res){
       res.redirect('/bfc2');
    });

    /*  시즌 1 종료 관계로 모든 경로 차단 및 bfc.castvot.com으로 접속 시 /bfc2로 리다이렉트.

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
            //res.render('./check',{title:"점검중",text:data});
            res.render('./comming',{title:"준비중",text:data});
        });
    });

    // test 메인
    router.get('/maintest', function (req, res) { res.render('./main',{title:"홈"}); });

    // 투표상금 (보팅 어워드)
    router.get('/prize', function (req, res) { res.render('./prize',{title:"보팅 어워드"}); });

    // 공지사항
    // 게시판 안만들고 html으로 갈 예정
    // TODO: dynamic으로 바꾸자
    router.group("/notice", function(router) {
        router.get('/', function (req, res) { res.render('./notice/list',{title:"공지사항"}); });
        //router.get('/:postId', function (req, res) { res.render('./notice/detail',{title:"공지사항"}); });
        router.get('/1', function (req, res) { res.render('./notice/detail',{title:"공지사항"}); });
        router.get('/2', function (req, res) { res.render('./notice/detail2',{title:"공지사항"}); });
        router.get('/3', function (req, res) { res.render('./notice/detail3',{title:"공지사항"}); });
        router.get('/4', function (req, res) { res.render('./notice/detail4',{title:"공지사항"}); });
        router.get('/5', function (req, res) { res.render('./notice/detail5',{title:"공지사항"}); });
        router.get('/6', function (req, res) { res.render('./notice/detail6',{title:"공지사항"}); });
        router.get('/7', function (req, res) { res.render('./notice/detail7',{title:"공지사항"}); });
    });

    // 후보자페이지
    router.group("/boys", function(router) {
        //router.get('/', function (req, res) { res.render('./preparing',{title:"후보자목록"}); });
        router.get('/:boyId', boysController.boyDetail); // 후보자상세보기
        router.get('/:boyId/edit', boysController.boyEditForm); // 후보자수정요청
        //router.get('/:boyId/qrcode', function (req, res) { res.render('./preparing',{title:"QR코드"}); });
    });

    // 후보추천
    router.group("/newboy", function(router) {
        //router.use(auth.devOnly); // 개발자IP만 사용가능
        //if(config.is_production) router.use(basicAuth(config.basic_auth)); // 임시로 실환경에서는 basicAuth 걸어놈
        router.use(auth.authCheck); // 인증확인
        // 후보자등록(폼)
        router.get('/', function (req, res) { res.render('./newboy/newboy_form',{title:"후보자등록"}); });
    });

    // support
    router.group("/support", function(router) {
        router.get('/companyinfo', function (req, res) { res.render('./support/companyinfo',{title:"회사소개"}); });
        router.get('/policy', function (req, res) { res.render('./support/policy',{title:"이용약관"}); });
        router.get('/privacy', function (req, res) { res.render('./support/privacy',{title:"개인정보처리방침"}); });
        router.get('/youth', function (req, res) { res.render('./support/youth',{title:"청소년보호정책"}); });
        router.get('/nomail', function (req, res) { res.render('./support/nomail',{title:"이메일수집금지"}); });
    });

    */


    ////////////////////////////////////////////////////////////////////////
    // member 관련

    router.get('/bfc2/login', function (req, res) {
        console.log("TryLogin:"+req.ip+":"+req.user);

        // TODO: 9/14일 지울것!!!
        // 이전에 ttl없이 발급된 connect.sid 지움
        if ( typeof req.cookies['connect.sid'] !== undefined ) res.clearCookie('connect.sid');
        if(req.isAuthenticated()) {
            // res.redirect('/bfc2/newboy2'); // 로그인 되어있으면 redirect 처리
            res.redirect('/bfc2/recommend'); // admin용 후보등록 - 로그인 되어있으면 redirect 처리.
        } else {
            res.render('./bfc2_view/member/login_form',{title:"로그인"});
        }
    });

    router.group("/bfc2/login/auth", function(router) {
        // TODO: login_success_uri는 login시 redir값 받아서 처리
        // var login_success_uri = '/bfc2/newboy2';
        var login_success_uri = '/bfc2/recommend'; // admin용 후보자등록
        var login_failure_uri = '/bfc2/login';

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
    // router.get('/logout', function (req, res) {
    //     // 로그인 세션 있으면 지움
    //     if(req.user) req.session.destroy();
    //     res.redirect('/');
    // });
    router.get('/logout2', function (req, res) {
        // 로그인 세션 있으면 지움
        if(req.user) req.session.destroy();
        // res.redirect('/bfc2');
        res.redirect('/bfc2/recommend'); // admin용 후보추천. 후보추천 완료시 다시 로그인페이지로 리다이렉트.
    });

    ////////////////////////////////////////////////////////////////////////
    // Ajax
    // TODO: 향후 함수로 모두 뺄것
    router.group("/ajax", function(router) {
        // FIXME: 임시로 풀어놈.
        //router.use(auth.authCheck); // 인증확인
        // TODO: 인증에러시 json으로 출력
        router.get('/update_main',updateController.updateMain); // 메인페이지 업데이트
        // router.post('/newboy', newboyController.newboyProcessing); // 후보추천 - 후보자등록완료
        // router.post('/newboy2', newboy2Controller.newboyProcessing); // 시즌2 후보추천 - 후보자등록완료
        // router.post('/recommend', recommendController.newboyProcessing); // 시즌2 admin용 후보추천
        router.post('/imgupload',imguploadController.UploadImages); // 이미지 업로드
        router.get('/update_boylist', boylistController.updateBoylist); // 후보목록 페이지 업데이트
        router.post('/search', searchController.search); // 후보목록 검색
    });


    ////////////////////////////////////////////////////////////////////////
    // 시즌2
    router.group("/bfc2",function(router){
        router.get('/',function(req,res){
            cache.get("maintenance",function(err, data){

                if(err){
                    console.log("cache:get:error:" + err);
                    res.status(200).render('./bfc2_view/error', { text:"접속에 문제가 있습니다." } )
                    return;
                }

                if(data === null){ // 캐쉬 없을때
                    res.render('./bfc2_view/main');
                    return;
                }
                res.render('./bfc2_view/preparing',{title:"준비중",text:data});
            });
        });

        // 후보자페이지
        router.group("/boys", function(router) {
            router.get('/:boyId', boysController_bfc2.boyDetail); // 후보자상세보기
            // router.get('/:boyId/edit', boysController_bfc2.boyEditForm);
            // 후보자수정요청
            //router.get('/:boyId/qrcode', function (req, res) { res.render('./preparing',{title:"QR코드"}); });
        });

        // 보팅어워즈
        router.get('/prize', function (req, res) { res.render('./bfc2_view/prize',{title:"보팅 어워드"}); });

        // support
        router.group("/support", function(router) {
            router.get('/companyinfo', function (req, res) { res.render('./bfc2_view/support/companyinfo',{title:"회사소개"}); });
            router.get('/policy', function (req, res) { res.render('./bfc2_view/support/policy',{title:"이용약관"}); });
            router.get('/privacy', function (req, res) { res.render('./bfc2_view/support/privacy',{title:"개인정보보호수집이용동의"}); });
            router.get('/youth', function (req, res) { res.render('./bfc2_view/support/youth',{title:"청소년보호정책"}); });
            router.get('/nomail', function (req, res) { res.render('./bfc2_view/support/nomail',{title:"이메일수집금지정책"}); });
        });

        // notice
        router.group("/notice", function(router){
            router.get('/', function (req, res) { res.render('./bfc2_view/notice/list', {title:"공지사항"}); });
            router.get('/1', function (req, res) { res.render('./bfc2_view/notice/detail',{title:"공지사항"}); });
            router.get('/2', function (req, res) { res.render('./bfc2_view/notice/detail2',{title:"공지사항"}); });
            router.get('/3', function (req, res) { res.render('./bfc2_view/notice/detail3',{title:"공지사항"}); });
            router.get('/4', function (req, res) { res.render('./bfc2_view/notice/detail4',{title:"공지사항"}); });
        });

        // 시즌2 후보추천
        // router.group("/newboy2", function(router) {
        //     router.use(auth.authCheck); // 인증확인
        //     router.get("/", function(req, res) {
        //         res.render('./bfc2_view/newboy/newboy_form', {title:"후보자등록"});
        //     });
        // });

        // admin용 후보추천
        router.group("/recommend", function(router) {
            router.use(auth.authCheck); // 인증확인
            router.get("/", function(req, res) {
                res.render('./bfc2_view/newboy/newboy_form', {title:"후보자등록"});
            });
        });

        // 후보목록
        router.get("/boylist", function(req, res){
            res.render('./bfc2_view/boylist/boylist', {title: "후보목록"});
        });

    });

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

    return router;
}
