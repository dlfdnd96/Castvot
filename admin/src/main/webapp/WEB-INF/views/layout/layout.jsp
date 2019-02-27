<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator"
	prefix="decorator"%>
<%@ taglib prefix="page" uri="http://www.opensymphony.com/sitemesh/page"%>
<%@ page session="false"%>
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
	<link href="/resources/assets/css/lib/vector-map/jqvmap.min.css" rel="stylesheet">

	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,800' rel='stylesheet' type='text/css'>

	<!-- <script type="text/javascript" src="https://cdn.jsdelivr.net/html5shiv/3.7.3/html5shiv.min.js"></script> -->

	<link rel="stylesheet" href="/resources/assets/css/custom-style.css">

	<decorator:head></decorator:head>
</head>

<body>

<page:applyDecorator name="leftNav"/>

<!-- Right Panel -->

<div id="right-panel" class="right-panel">

	<page:applyDecorator name="topNav"/>
	<decorator:body></decorator:body>

</div><!-- /#right-panel -->

<div class="wrap-loading display-none">

	<div><img src="/resources/images/loading.gif" /></div>

</div>


	<!-- Right Panel -->

	<script src="/resources/assets/js/vendor/jquery-2.1.4.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.3/umd/popper.min.js"></script>
	<script src="/resources/assets/js/plugins.js"></script>
	<script src="/resources/assets/js/main.js"></script>

	<script src="/resources/assets/js/common-util.js"></script>

	<decorator:getProperty property="page.pageScript"/>

</body>

</html>