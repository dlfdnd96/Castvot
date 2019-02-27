<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>
<%--lightbox css--%>
<link rel="stylesheet" href="/resources/lightbox2-master/dist/css/lightbox.css">
<%--href="< c:url value='/resources/lightbox2-master/dist/css/lightbox.css' >"--%>

<head>

	<style>

		.fileDrop {
			width: 100%;
			height: 200px;
			border: 2px dotted #0b58a2;
		}

	</style>

</head>

<body>
<div class="breadcrumbs">
	<div class="col-sm-4">
		<div class="page-header float-left">
			<div class="page-title">
				<h1>공지사항 > 공지사항 등록</h1>
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
						<hr>
						<form action="" method="post" id="board-form" enctype="multipart/form-data">
							<div class="form-group text-left">
								<label class="control-label mb-1">* 제목: </label>
								<input type="text" name="title" id="title" style="width: 520px;" placeholder="제목을 입력하세요">
							</div>
							<div class="form-group text-left">
								<label class="control-label mb-1">* 내용: </label>
								<textarea name="content" id="content"></textarea>
							</div>
							<div class="form-group text-left">
								<label class="control-label mb-1">글쓴이: </label>
								<div name="writer" id="writer" style="display: inline">캐스팅보트솔루션</div>
							</div>
							<%--첨부파일 영역 추가--%>
							<div class="form-group">
								<div class="fileDrop">
									<br/>
									<br/>
									<br/>
									<br/>
									<p class="text-center"><i class="fa fa-paperclip"></i> 첨부파일을 드래그해주세요.</p>
								</div>
							</div>
							<%--첨부파일 영역 추가--%>
							<div class="form-group text-left">
								<span>* 표시는 필수 입력 입니다.</span>
							</div>
							<div style="text-align: right">
								<button id="btn-save" type="button" class="btn btn-lg btn-info">
									<span id="save-button-amount">저장</span>
								</button>
								<button id="exit-button" type="button" class="btn btn-lg btn-danger" onclick="javascript:location.href = '/board/list'">
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

<script type="text/javascript" src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="< c:url value='/resources/se2/js/HuskyEZCreator.js' />" charset="utf-8"></script>
<script type="text/javascript">

	( function ( $ ) {

		var oEditors = [];
		var errorMessage = "필수 입력 부분을 입력 해 주세요.";

		nhn.husky.EZCreator.createInIFrame({
			oAppRef: oEditors,
			elPlaceHolder: "content",
			sSkinURI: "/resources/se2/SmartEditor2Skin.html",
			fCreator: "createSEditor2",
			htParams: {
				bUseToolbar: true, // 툴바 사용 여부
				bUseVerticalResizer: true, // 입력창 크기 조절바 사용 여부
				bUseModeChanger: true, // 모드 탭(Editor, HTML, TEXT) 사용 여부
				// bSkipXssFilter: true
			}
		});

		// $( '#title' ).blur( function() {
        //
		// 	validationCheck( '#title' );
        //
		// });

		$( '#btn-save' ).on( 'click' , function() {

			oEditors.getById["content"].exec("UPDATE_CONTENTS_FIELD", []); //id가 content인 textarea에 에디터에서 대입
			var title = $( '#title' );
			var contents = $.trim(oEditors[0].getContents());

			if( checkRequiredFeild( title ) == false ) {

				return false;

			}


            if( checkSE2Feild( contents ) == false ){

                return false;

            }

			if ( confirm( "등록 하시겠습니까?" ) ) {

				registerBoard( $( '#board-form' ) )
					.then( function () {
						alert( "등록 되었습니다." );
						location.href = "/board/list";
					} )
					.fail( function( err ) {
						alert( "등록 실패" );
						console.log( err );
					} )
			}

		} )

        // 게시글 저장 버튼 클릭 이벤트 처리
        $("#writeForm").submit(function (event) {
            event.preventDefault();
            var that = $(this);
            filesSubmit(that);
        });

        // 파일 삭제 버튼 클릭 이벤트
        $(document).on("click", ".delBtn", function (event) {
            event.preventDefault();
            var that = $(this);
            deleteFileWrtPage(that);
        });

        function registerBoard( form ) {

			var form = form[ 0 ],
				formData = new FormData( form ),
				option   = { mimeType: "multipart/form-data", dataType: "json", processData: false, contentType: false };

			return castvot.util.apiCall( "/api/board/register", formData, option );

		}

		// function validationCheck( id ) {
        //
		// 	var idValue = $( id ).val();
        //
		// 	$( '.error' ).remove();
        //
		// 	if( idValue.length < 1 ) {
        //
		// 		$( id ).after( '<div><span class="error" style="color: red;">' + errorMessage + '</span></div>' );
        //
		// 	}
        //
		// }

        // function SE2validationCheck( SE2id ) {
        //
        //     var contents = $.trim(oEditors[0].getContents());
        //     console.log(contents);
        //
        //     if( contents === '<p>&nbsp;</p>' || contents === '' ){
        //
        //         // $( '#error-content' ).attr( '<div><span class="error" style="color: red;">' + errorMessage + '</span></div>' );
        //         $( '#error-content' )
        //             .addClass( "error" )
        //             .css( "color", "red" )
        //             .text(errorMessage);
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

	} )( $ )

</script>

</body>



