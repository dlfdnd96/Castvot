<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>
<head>
    <style>
        .main_image {
            width: 100px;
        }
    </style>
</head>
<body>

<div class="breadcrumbs">
    <div class="col-sm-4">
        <div class="page-header float-left">
            <div class="page-title">
                <h1>Wannabj 후보 승인 관리</h1>
            </div>
        </div>
    </div>
</div>


    <div class="content mt-3">
        <div class="col-lg-12">
            <div class="card">
<form>
                <div class="card-header">
                    <table class="table table-sm table-bordered form-group-sm">
                        <colgroup>
                            <col width="10%">
                            <col width="10%">
                            <col width="10%">
                            <col width="50%">
                            <col width="20%">
                        </colgroup>
                        <tbody>
                        <tr>
                            <th>
                                <%--<input type="hidden" id="bfcSeasonNumber" name="bfcSeasonNumber" value="${wannabjParam.bfcSeasonNumber}">--%>

                                <select id="searchType" name="searchType" class="form-control">
                                    <option value="BJ_NAME">후보자명</option>
                                    <option value="USER_NAME">등록자명</option>
                                </select>
                            </th>
                            <th>
                                <select id="sortType" name="sortType" class="form-control">
                                    <option value="DESC" ${wannabjParam.sortType == 'DESC' ? 'selected' : ''}>최신순</option>
                                    <option value="ASC" ${wannabjParam.sortType == 'ASC' ? 'selected' : ''}>오래된순</option>
                                </select>
                            </th>
                            <th>
                                <select id="statusType" name="statusType" class="form-control">
                                    <option value="">전체</option>
                                    <c:forEach items="${wannabjCode}" var="code">

                                        <option value="${code}" ${wannabjParam.statusType == code ? 'selected' : ''}>${code.codeName}</option>

                                    </c:forEach>
                                </select>
                            </th>
                            <td>
                                <input id="searchValue" name="searchValue" class="form-control" type="text" value="${wannabjParam.searchValue}">
                            </td>
                            <td>
                                <button type="submit" class="btn btn-info">검색</button>
                                <button type="button" class="btn btn-danger" id="remove">선택 삭제</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <input type="hidden" name="pageSize" id="pageSize" value="${wannabjParam.pageSize}">
                </div>
</form>
                <div class="card-body">
                    <table class="table">
                        <colgroup>
                            <col width="10%">
                            <col width="20%">
                            <col width="20%">
                            <col width="20%">
                            <col width="10%">
                            <col width="20%">
                        </colgroup>
                        <thead class="thead-dark">
                        <tr>
                            <th scope="col"><input type="checkbox" id="checkAll"></th>
                            <th scope="col">대표이미지</th>
                            <th scope="col">후보자명</th>
                            <th scope="col">등록자명</th>
                            <th scope="col">상태</th>
                            <th scope="col">등록일</th>
                        </tr>
                        </thead>
                        <tbody>
                        <c:forEach items="${wannabjVOList}" var="wannabj">
                            <tr>
                                <td><input type="checkbox" value="${wannabj.pk}" class="checkVal"></td>
                                <td><img src="${UPLOAD_URL}${wannabj.bjPhoto1}-small.jpg" class="main_image"></td>
                                <th scope="row"><a href="javascript:location.href='/wannabj/detail?pk=${wannabj.pk}'; castvot.util.setQureyString();">${wannabj.bjName}</a></th>
                                <c:if test="${wannabj.selfYn eq 0}"><td>${wannabj.recName}</td></c:if>
                                <c:if test="${wannabj.selfYn eq 1}"><td>${wannabj.bjName}</td></c:if>
                                <td>${wannabj.status.codeName}</td>
                                <td>${wannabj.cdate}</td>
                            </tr>
                        </c:forEach>
                        </tbody>
                    </table>
                    <div class="col-sm-12 col-md-7">
                        <castvottag:wannabjPaging value="${wannabjParam}"></castvottag:wannabjPaging>
                    </div>
                </div>
            </div>
        </div>
    </div>


<content tag="pageScript">
    <script>

        ( function ( $ ) {

            $( '#remove' ).on( 'click', function () {

                var pks = [];

                $( '.checkVal:checked' ).each( function ( idx, item ) {
                    pks.push( item.value )
                } )

                if (pks.length > 0 && confirm("정말 삭제 하시겠습니까?")) {
                    castvot.util.apiCall( '/api/wannabj/remove', {
                        pks: pks.join( ',' ),
                    } ).then( function () {
                        alert( '삭제 성공' );
                        location.reload();
                    } ).fail( function ( err ) {
                        alert( '삭제 실패' );
                        console.log( err )
                    } )
                }



            } )

            $( '#checkAll' ).on( 'click', function () {

                var isChecked = $( this ).is( ':checked' );
                $( '.checkVal' ).prop( 'checked', isChecked );

            } )

        } )( $ )

    </script>

</content>

</body>