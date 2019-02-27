<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>

<head>
    <style>

        .list-inline-item > img {
            width: 200px;
            height: 200px;
        }

        .photo {
            width: 200px;
        }

    </style>
</head>
<body>

<form class="" name="dataForm" id="dataForm" enctype="multipart/form-data">


<input type="hidden" name="status" id="status" value="${candidateVO.status}">
<input type="hidden" name="pk" id="pk" value="${candidateVO.pk}">
<input type="hidden" name="bfcSeasonNumber" value="${candidateVO.bfcSeasonNumber}">

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
                            <h3 class="text-center"><input id="boyName" name="boyName" class="form-control" type="text" value="${candidateVO.boyName}"></h3>
                        </div>
                        <hr>
                        <form action="" method="post" novalidate="novalidate">
                            <div class="form-group text-center">
                                <ul class="list-inline">
                                    <li class="list-inline-item">
                                        <img src="${UPLOAD_URL}${candidateVO.photo1}-small.jpg" id="photo1">
                                        <input type="file" name="photo1" class="form-control photo">
                                    </li>
                                    <li class="list-inline-item">
                                        <img src="${UPLOAD_URL}${candidateVO.photo2}-small.jpg" id="photo2">
                                        <input type="file" name="photo2" class="form-control photo">
                                    </li>
                                    <li class="list-inline-item">
                                        <img src="${UPLOAD_URL}${candidateVO.photo3}-small.jpg" id="photo3">
                                        <input type="file" name="photo3" class="form-control photo">
                                    </li>
                                </ul>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천 상태</label>
                                <div>${candidateVO.status.codeName}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천 등록자</label>
                                <div>${candidateVO.recommender}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천인 소속사</label>
                                <div><input type="text" value="${candidateVO.boyManagement}" style="width: auto;" id="boyManagement" name="boyManagement"></div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천인 생년월일</label>
                                <div>
                                    <input type="text" value="${candidateVO.boyBirthYear}" style="width: 10%;" id="boyBirthYear" name="boyBirthYear">년
                                    <input type="text" value="${candidateVO.boyBirthMonth}" style="width: 10%;" id="boyBirthMonth" name="boyBirthMonth">월
                                    <input type="text" value="${candidateVO.boyBirthDate}" style="width: 10%;" id="boyBirthDate" name="boyBirthDate">일
                                </div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천인 혈액형</label>
                                <div>
                                    <select id="boyBloodType" name="boyBloodType">
                                        <option value="A" <c:if test="${candidateVO.boyBloodType eq 'A'}">selected</c:if>>A</option>
                                        <option value="B" <c:if test="${candidateVO.boyBloodType eq 'B'}">selected</c:if>>B</option>
                                        <option value="AB" <c:if test="${candidateVO.boyBloodType eq 'AB'}">selected</c:if>>AB</option>
                                        <option value="O" <c:if test="${candidateVO.boyBloodType eq 'O'}">selected</c:if>>O</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천인 이름공개</label>
                                <div>${candidateVO.publicAgree ? "YES" : "NO"}</div>
                            </div>
                            <div class="form-group text-center">
                                <label class="control-label mb-1">추천사유</label>
                                <div><textarea rows="10" name="reason" id="reason" class="form-control">${candidateVO.reason}</textarea></div>
                            </div>
                            <c:forEach items="${coinList}" var="coin">
                                <div class="form-group text-center">
                                    <label class="control-label mb-1">${coin.coinType.title} 주소</label>
                                    <div>${coin.account}</div>
                                </div>
                            </c:forEach>
                            <div style="text-align: center">
                                <button id="update-button" type="button" class="btn btn-lg btn-danger">
                                    <span id="update-button-amount">수정</span>
                                </button>
                                <button id="exit-button" type="button" class="btn btn-lg btn-warning" onclick="javascript:location.href = '/candidate/list?' + castvot.util.getQureyString('list');">
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

    <script>

        ( function ( $ ) {

            $( '#update-button' ).on( 'click', function () {

                if ( confirm( "수정 하시겠습니까?" ) ) {

                    registSendImageUpload( $( '#dataForm' ) )
                        .then(function () {
                            alert('수정 되었습니다.');
                            location.reload();
                        })
                        .fail(function () {
                            alert( '수정 실패' )
                        });

                }

            } )

            $( 'input[type=file]' ).on( 'change', function () {

                var $this = $( this ),
                    name  = $this.attr( 'name' );
                $( this ).preViewImage( name )

            } )

            function registSendImageUpload( form ) {

                var form     = form[ 0 ],
                    formData = new FormData( form ),
                    option   = { mimeType: "multipart/form-data", dataType: "json", processData: false, contentType: false };

                return castvot.util.apiCall( "/api/candidate/update", formData, option );

            }

        } )( $ )

    </script>


</content>

</body>