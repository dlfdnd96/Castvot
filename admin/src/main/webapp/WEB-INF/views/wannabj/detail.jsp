<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>
<head>
    <style>

        .list-inline-item > img {
            width: 200px;
        }
    </style>
</head>
<body>

<input type="hidden" id="status" value="${wannabjVO.status}">

<div class="breadcrumbs">
    <div class="col-sm-4">
        <div class="page-header float-left">
            <div class="page-title">
                <h1>후보 승인 관리 > 후보자 상세</h1>
            </div>
        </div>
    </div>
</div>

<div class="content mt-3">
    <div class="col-lg-12">
        <div class="card">
            <div class="card-body">
                <!-- Credit Card -->
                <div id="pay-invoice">
                    <div class="card-body">
                        <div class="card-title">
                            <h3 class="text-center">${wannabjVO.bjName}</h3>
                        </div>
                        <hr>
                        <form action="" method="post" novalidate="novalidate">
                            <div class="form-group text-center">
                                <ul class="list-inline">
                                    <li class="list-inline-item"><img src="${UPLOAD_URL}${wannabjVO.bjPhotoName1}-small.jpg"></li>
                                    <li class="list-inline-item"><img src="${UPLOAD_URL}${wannabjVO.bjPhotoName2}-small.jpg"></li>
                                    <li class="list-inline-item"><img src="${UPLOAD_URL}${wannabjVO.bjPhotoName3}-small.jpg"></li>
                                    <li class="list-inline-item"><img src="${UPLOAD_URL}${wannabjVO.bjPhotoName4}-small.jpg"></li>
                                </ul>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천 상태</label>
                                <div>${wannabjVO.status.codeName}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">bj 컨텐츠</label>
                                <div>${wannabjVO.bjContents}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">bj 대표채널</label>
                                <div>${wannabjVO.bjActiveArea}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천사유</label>
                                <div>${wannabjVO.reason}</div>
                            </div>
                            <c:forEach items="${coinList}" var="coin">
                                <div class="form-group text-center">
                                    <label class="control-label mb-1">${coin.coinType.title} 주소</label>
                                    <div>${coin.account}</div>
                                </div>
                            </c:forEach>
                            <div style="text-align: center">
                                <button id="agree-button" type="button" class="btn btn-lg btn-info">
                                    <span id="agree-button-amount">승인</span>
                                </button>
                                <button id="reject-button" type="button" class="btn btn-lg btn-danger">
                                    <span id="reject-button-amount">반려</span>
                                </button>
                                <button id="update-button" type="button" class="btn btn-lg btn-success" onclick="javascript:location.href = '/candidate/detailUpdate?bfcSeasonNumber=${candidateVO.bfcSeasonNumber}&pk=${candidateVO.pk}';">
                                    <span id="update-button-amount">수정</span>
                                </button>
                                <button id="exit-button" type="button" class="btn btn-lg btn-warning" onclick="javascript:location.href = '/candidate/list?' + castvot.util.getQureyString('list');;">
                                    <span id="exit-button-amount">나가기</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<content tag="pageScript">

    <script>

        ( function ( $ ) {

            var util = castvot.util;

            $( '#agree-button' ).on( 'click', function () {

                if ( confirm( "승인 하시겠습니까?" ) ) {

                    if ( $( '#status' ).val() != 'ACTIVE' ) {
                        util.apiCall( "/api/candidate/status", {
                            status: 'ACTIVE',
                            pk    : util.qureyToObj().pk,
                            bfcSeasonNumber: util.qureyToObj().bfcSeasonNumber
                        } ).then( function () {

                            alert( "승인 되었습니다." );
                            location.reload();

                        } ).fail( function ( err ) {
                            alert( "승인 실패" );
                            console.log( JSON.stringify( err ) );
                        } )
                    } else {
                        alert( '이미 승인 되었습니다.' );
                    }

                }

            } )

            $( '#reject-button' ).on( 'click', function () {

                if ( confirm( "반려 하시겠습니까?" ) ) {

                    if ( $( '#status' ).val() != 'REJECT' ) {

                        util.apiCall( "/api/candidate/status", {
                            status: 'REJECT',
                            pk    : util.qureyToObj().pk,
                            bfcSeasonNumber: util.qureyToObj().bfcSeasonNumber
                        } ).then( function () {

                            alert( "반려 되었습니다." );
                            location.reload();

                        } ).fail( function ( err ) {
                            alert( "반려 실패" );
                            console.log( JSON.stringify( err ) );
                        } )
                    } else {
                        alert('이미 반려 되었습니다.')
                    }
                }

            } )

        } )( $ )

    </script>


</content>

</body>