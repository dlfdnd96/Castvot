/*
 * entrypoint
 *
 * Author: 공용
 *
 * TODO: i18n 지원
 * TODO: logger 붙일것
 * TODO: redis timeout
 * TODO: csrf
 *
 */

var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var expressValidator = require('express-validator');
const rateLimit = require("express-rate-limit");
var redis = require("redis");
var cookieParser = require('cookie-parser');
var timeout = require('connect-timeout');

var todayVote = require('./middlewares/todayVote'); // 오늘 최다투표량 저장 미들웨어
todayVote.todayVoteJob();

const limiter = rateLimit({
    windowMs: 3 * 1000, // 15 minutes
    max: 5, // limit each IP to 10 requests per windowMs
    message:    "페이지는 자동으로 변경됩니다. F5 등의 리프레쉬는 하지말아주시기 바랍니다."
});

const limiterApi = rateLimit({
    windowMs: 5 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message:    '{"status":false,"message":"TooManyRequests"}'
});

var app = express();
app.use(timeout('10s')) // timeout 5초 적용

// config 전역변수 세팅
// NODE_ENV=production node app.js
// TODO: 파일업거나 parse 에러시 exception 처리
if (process.env.NODE_ENV === "production"){
    global.config = JSON.parse(fs.readFileSync('./config/production.json'));
} else {
    global.config = JSON.parse(fs.readFileSync('./config/development.json'));
}
console.log("Start:env:" + config.env + ":==========================================================");

// global 변수 선언
global.dbpool = mysql.createPool(config.mysql.dbconn); // dbpool, redis는 귀찮으니 global로 선언
global.dumpobj = require('util').inspect; // 임시 디버깅용
global.cache  = redis.createClient({host:config.redis.host}); // redis 글로벌로 사용

global.isSelf = undefined;

/*
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands with
            // a individual error
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all commands
            // with a individual error
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
    }
*/
var csrfProtection = csrf({ cookie: true })

// FIXME: connect-redis 때문에 redis를 두개 물고 들어감;;;
cache.on("error", function (err){
    // TODO: redis 에러 처리
    console.log("RedisError:" + err);
});

app.set('view engine', 'ejs'); // 템플릿 엔진 ejs 사용 선언. res.render 메소드에서 .ejs 생략 가능
app.set('views', './views'); // views 파일들이 있는 경로 설정

app.disable('x-powered-by'); // for Security
app.enable('trust proxy'); // behind elb

// app.use(limiter); // rate limit 적용
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(haltOnTimedout)
app.use(cookieParser());
app.use(haltOnTimedout)
app.use(expressValidator()); // express-validator 사용

// 개발환경 분리
if (config.is_production) {  // production mode
    // force redirect https (elb 사용으로 여기서 처리함. nginx 설정 바꾸기 귀찬흠)
    app.use(function(req, res, next) {

        // TODO: 추후에 실서버 작업할 때 반드시 ! 추가할 것.
        // TODO: ↘ if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {

        if(!(req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
            res.redirect('https://' + req.get('Host') + req.url);
        } else next();
    });
} else {    // devel mode
    app.use('/', express.static(__dirname + '/public')); // public 디렉토리. 실 환경에서는 Cloudfront 등으로 분리하여 처리
}

// 세션으로 레디스 설정
// TODO: redis pool, config.session.type 확인하여 redis, memcached, local등으로 분리 처리
app.use(session({
    store: new RedisStore({
        host: config.redis.host,
        port: config.redis.port,
        ttl: config.session.ttl,
        prefix: config.session.prefix
    }),
    resave: config.session.resave, // 세션을 언제나 저장할 지 정하는 값
    saveUninitialized: config.session.saveUninitialized, // 세션이 저장되기 전 초기화가 안된 상태로 미리 만들어서 저장
    secret: config.session.secret, // 세션을 암호화 하여 저장
    cookie: config.session.cookie,
    name: config.session.name
}));

// FIXME: 임시로 개발환경에만 넣음
//if(!config.is_production) app.use('/',require('./routers/blockchain.js'));
app.use('/', require('./routers/index.js')());

// Status 404 (Error) middleware
app.use('*', require("./middlewares/errorHandler").NotFoundHandler);
// 기본 에러핸들러

app.use(require("./middlewares/errorHandler").DefaultHandler);

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
}

app.listen(config.server.listen, function () {
    console.log("Start:app.listen:port:" + config.server.listen.port);
});
