<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%@ include file="/WEB-INF/views/layout/include/incPageVar.jsp" %>

<head>

</head>
<body>

<div class="breadcrumbs">
	<div class="col-sm-4">
		<div class="page-header float-left">
			<div class="page-title">
				<h1>공지사항</h1>
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
							<col width="50%">
							<col width="20%">
							<%--<col width="20%">--%>
						</colgroup>
						<tbody>
						<tr>
							<th>
								<select id="searchType" name="searchType" class="form-control">
									<option value="TITLE">제목</option>
								</select>
							</th>
							<th>
								<select id="sortType" name="sortType" class="form-control">
									<option value="DESC" ${articleParam.sortType == 'DESC' ? 'selected' : ''}>최신순</option>
									<option value="ASC" ${articleParam.sortType == 'ASC' ? 'selected' : ''}>오래된순</option>
								</select>
							</th>
							<%--<th>--%>
								<%--<select id="statusType" name="statusType" class="form-control">--%>
									<%--<option value="">전체</option>--%>
									<%--<c:forEach items="${candidateCode}" var="code">--%>

										<%--<option value="${code}" ${candidateParam.statusType == code ? 'selected' : ''}>${code.codeName}</option>--%>

									<%--</c:forEach>--%>
								<%--</select>--%>
							<%--</th>--%>
							<td>
								<input id="searchValue" name="searchValue" class="form-control" type="text" value="${articleParam.searchValue}">
							</td>
							<td>
								<button type="submit" class="btn btn-info">검색</button>
								<button type="button" class="btn btn-danger" id="remove">선택 삭제</button>
							</td>
						</tr>
						</tbody>
					</table>
					<input type="hidden" name="pageSize" id="pageSize" value="${articleParam.pageSize}">
				</div>
			</form>
			<div class="card-body">
                <div style="text-align: right; margin-bottom: 1%;">
                    <a href="javascript:location.href='/board/registerEdit'"><button type="button" class="btn btn-info">글쓰기</button></a>
                </div>
				<table class="table">
					<colgroup>
						<col width="5%">
						<col width="10%">
						<col width="20%">
						<col width="10%">
						<col width="10%">
						<col width="10%">
						<col width="10%">
					</colgroup>
					<thead class="thead-dark">
					<tr>
						<th scope="col"><input type="checkbox" id="checkAll"></th>
						<th scope="col">번호</th>
						<th scope="col">제목</th>
						<th scope="col">글쓴이</th>
						<th scope="col">작성일</th>
						<th scope="col">수정일</th>
						<th scope="col">조회수</th>
					</tr>
					</thead>
					<tbody>
					<c:forEach items="${articleVOList}" var="article">
						<tr>
							<td><input type="checkbox" value="${article.articleNo}" class="checkVal"></td>
							<td>${article.rownum}</td>
							<%--<td><img src="${UPLOAD_URL}${candidate.photo1}-small.jpg" class="main_image"></td>--%>
							<th scope="row"><a href="javascript:location.href='/board/detail?articleNo=${article.articleNo}'; castvot.util.setQureyString();">${article.title}</a></th>
							<td>${article.writer}</td>
							<td>${article.regDate}</td>
							<td>${article.mdfyDate}</td>
							<td>${article.viewCnt}</td>
						</tr>
					</c:forEach>
					</tbody>
				</table>
				<div class="col-sm-12 col-md-7">
					<castvottag:paging value="${articleParam}"></castvottag:paging>
				</div>
			</div>
		</div>
	</div>
</div>


<content tag="pageScript">
	<script>

        ( function ( $ ) {

            $( '#remove' ).on( 'click', function () {

                var articleNumbers = [];

                $( '.checkVal:checked' ).each( function ( idx, item ) {
                    articleNumbers.push( item.value );
                } )

                if (articleNumbers.length > 0 && confirm("정말 삭제 하시겠습니까?")) {
                    castvot.util.apiCall( '/api/board/remove', {
                        articleNumbers: articleNumbers.join( ',' )
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

