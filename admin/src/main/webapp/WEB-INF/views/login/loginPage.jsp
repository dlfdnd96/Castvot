<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!doctype html>
<html lang="ko">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sufee Admin - HTML5 Admin Template</title>
    <meta name="description" content="Sufee Admin - HTML5 Admin Template">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="apple-touch-icon" href="apple-icon.png">
    <link rel="shortcut icon" href="favicon.ico">

    <link rel="stylesheet" href="/resources/assets/css/normalize.css">
    <link rel="stylesheet" href="/resources/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/resources/assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="/resources/assets/css/themify-icons.css">
    <link rel="stylesheet" href="/resources/assets/css/flag-icon.min.css">
    <link rel="stylesheet" href="/resources/assets/css/cs-skin-elastic.css">
    <!-- <link rel="stylesheet" href="assets/css/bootstrap-select.less"> -->
    <link rel="stylesheet" href="/resources/assets/scss/style.css">

    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>

    <link rel="stylesheet" href="/resources/assets/css/custom-style.css">

    <!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/html5shiv/3.7.3/html5shiv.min.js"></script> -->

</head>
<body class="bg-dark">


<div class="sufee-login d-flex align-content-center flex-wrap">
    <div class="container">
        <div class="login-content">
            <div class="login-logo">
                <a href="/login/loginPage">
                    <img class="align-content" src="/resources/images/logo.png" alt="">
                </a>
            </div>
            <div class="login-form">
                <form>
                    <div class="form-group">
                        <label>Admin ID</label>
                        <input type="text" id="userId" class="form-control" placeholder="ID">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" class="form-control" placeholder="Password">
                    </div>
                    <%--<div class="checkbox">
                        <label>
                            <input type="checkbox"> Remember Me
                        </label>
                        <label class="pull-right">
                            <a href="#">Forgotten Password?</a>
                        </label>

                    </div>--%>
                    <button type="button" id="loginBtn" class="btn btn-success btn-flat m-b-30 m-t-30">Sign in</button>
                    <%--<div class="social-login-content">
                        <div class="social-button">
                            <button type="button" class="btn social facebook btn-flat btn-addon mb-3"><i class="ti-facebook"></i>Sign in with facebook</button>
                            <button type="button" class="btn social twitter btn-flat btn-addon mt-2"><i class="ti-twitter"></i>Sign in with twitter</button>
                        </div>
                    </div>
                    <div class="register-link m-t-15 text-center">
                        <p>Don't have account ? <a href="#"> Sign Up Here</a></p>
                    </div>--%>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="wrap-loading display-none">

    <div><img src="/resources/images/loading.gif" /></div>

</div>

<script src="/resources/assets/js/vendor/jquery-2.1.4.min.js"></script>
<script src="/resources/assets/js/popper.min.js"></script>
<script src="/resources/assets/js/plugins.js"></script>
<script src="/resources/assets/js/main.js"></script>
<script src="/resources/assets/js/common-util.js"></script>

<script type="text/javascript">

    ( function ( $ ) {

        $( '#loginBtn' ).on( 'click', function () {
            loginProc();
        } )

        $( 'input' ).on( 'keydown', function ( e ) {

            if ( e.keyCode == 13 ) {

                loginProc();

            }

        } )

        function loginProc() {

            castvot.util
                .apiCall( '/login/loginProc', { userId: $( '#userId' ).val(), password: $( '#password' ).val() } )
                .then( function ( result ) {
                    console.log( result )
                    alert( '로그인에 성공하였습니다.' );
                    location.href = '/';
                } )
                .fail( function ( err ) {
                    alert( err.msg )
                } )

        }
    } )( $ )

</script>


</body>
</html>
