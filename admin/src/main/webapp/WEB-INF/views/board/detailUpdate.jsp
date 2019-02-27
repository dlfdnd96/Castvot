<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>
<head>

</head>
<body>

<form class="" name="dataForm" id="dataForm">

<%--<input type="hidden" name="status" id="status" value="${articleVO.status}">--%>
<input type="hidden" name="articleNo" id="articleNo" value="${articleVO.articleNo}">

<div class="breadcrumbs">
    <div class="col-sm-4">
        <div class="page-header float-left">
            <div class="page-title">
                <h1>공지사항 > 공지사항 상세</h1>
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
                        <%--<div class="card-title">--%>
                            <%--<h3 class="text-center"><input id="boyName" name="boyName" class="form-control" type="text" value="${candidateVO.boyName}"></h3>--%>
                        <%--</div>--%>
                        <hr>
                        <form action="" method="post" novalidate="novalidate">
                            <div class="form-group text-left">
                                <label class="control-label mb-1">* 제목: </label>
                                <input type="text" name="title" id="title" style="width: 94%;" value="${articleVO.title}">
                            </div>
                            <div class="form-group text-left">
                                <label class="control-label mb-1">* 내용: </label>
                                <textarea name="content" id="content" style="max-width: 100%; width: 100%;">${articleVO.content}</textarea>
                            </div>
                            <div class="form-group text-left">
                                <label class="control-label mb-1">글쓴이: </label>
                                <div name="writer" id="writer" style="display: inline">캐스팅보트솔루션</div>
                            </div>
                            <%--<c:forEach items="${coinList}" var="coin">--%>
                                <%--<div class="form-group text-center">--%>
                                    <%--<label class="control-label mb-1">${coin.coinType.title} 주소</label>--%>
                                    <%--<div>${coin.account}</div>--%>
                                <%--</div>--%>
                            <%--</c:forEach>--%>
                            <div style="text-align: right">
                                <button id="update-button" type="button" class="btn btn-lg btn-danger">
                                    <span id="update-button-amount">수정</span>
                                </button>
                                <button id="exit-button" type="button" class="btn btn-lg btn-warning" onclick="javascript:location.href = '/board/list?' + castvot.util.getQureyString('list');">
                                    <span id="exit-button-amount">취소</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</form>

<content tag="pageScript">

    <script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script type="text/javascript" src="< c:url value='/resources/se2/js/HuskyEZCreator.js' />" charset="utf-8"></script>
    <script>

        ( function ( $ ) {

            var oEditors = [];
            var errorMessage = "필수 입력 부분을 입력 해 주세요.";
            var searchString, val, params, articleNo;

            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: "content",
                sSkinURI: "/resources/se2/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams: {
                    bUseToolbar: true, // 툴바 사용 여부
                    bUseVerticalResizer: true, // 입력창 크기 조절바 사용 여부
                    bUseModeChanger: true // 모드 탭(Editor, HTML, TEXT) 사용 여부
                }
            });

            // $( '#title' ).blur( function() {
            //
            //     validationCheck( '#title' );
            //
            // });

            $( '#update-button' ).on( 'click', function () {

                oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []); //id가 content인 textarea에 에디터에서 대입
                var title = $( '#title' );
                var contents = $.trim(oEditors[0].getContents());

                if( checkRequiredFeild( title ) == false ) {

                    return false;

                }


                if( checkSE2Feild( contents ) == false ){

                    return false;

                }

                if ( confirm( "수정 하시겠습니까?" ) ) {

                    getArticleNo();

                    updateBoard( $( '#dataForm' ) )
                        .then(function () {
                            alert('수정 되었습니다.');
                            location.href='/board/detail?articleNo=' + articleNo
                        })
                        .fail(function () {
                            alert( '수정 실패' )
                        });

                }

            } )

            function updateBoard( form ) {

                var form = form[ 0 ],
                    formData = new FormData( form ),
                    option   = { mimeType: "text/plain", dataType: "json", processData: false, contentType: false };

                return castvot.util.apiCall( "/api/board/update", formData, option );

            }

            // function validationCheck( id ) {
            //
            //     var idValue = $( id ).val();
            //
            //     $( '.error' ).remove();
            //
            //     if( idValue.length < 1 ) {
            //
            //         $( id ).after( '<div><span class="error" style="color: red;">' + errorMessage + '</span></div>' );
            //
            //     }
            //
            // }

            function checkRequiredFeild( id ) {

                if( id.val().length < 1 ) {

                    alert(errorMessage);
                    $( id ).focus();

                    return false;

                }

            }

            function checkSE2Feild( SE2id ) {

                // 기본적으로 아무것도 입력하지 않아도 값이 입력되어 있음.
                if( SE2id === '<p>&nbsp;</p>' || SE2id === '' ){

                    alert(errorMessage);
                    oEditors.getById['content'].exec('FOCUS');

                    return false;

                }

            }

            function getArticleNo() {

                searchString = window.location.search.substring(1);
                params = searchString.split("&");

                for ( var i=0 in params ) {

                    val = params[i].split("=");

                    // if ( i == 1 ) {
                    //
                    //     return;
                    // }

                }

                articleNo = val[1];

            }

        } )( $ )

    </script>


</content>

</body>