<%@ tag language="java" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<%--
==============================
= 페이징 태그
=
= @param value <필수> CommonPagingParam 객체
==============================
--%>
<%@ attribute name="value" type="com.castvot.admin.vo.common.CommonPagingParam" required="true" %>

<div class="dataTables_paginate paging_simple_numbers" id="bootstrap-data-table_paginate">
	<ul class="pagination">
		<c:choose>
			<c:when test="${value.pageNo gt value.prevPageNo}">
				<li class="paginate_button page-item previous" id="bootstrap-data-table_previous">
					<a href="?pageNo=${value.prevPageNo}&searchType=${value.searchType}&searchValue=${value.searchValue}&sortType=${value.sortType}&sortValue=${value.sortValue}&statusType=${value.statusType != null ? value.statusType : ''}" aria-controls="bootstrap-data-table" class="page-link">Previous</a>
				</li>
			</c:when>
			<c:otherwise>
				<li class="paginate_button page-item previous disabled" id="bootstrap-data-table_previous">
					<a href="javascript:void(0)" aria-controls="bootstrap-data-table" class="page-link">Previous</a>
				</li>
			</c:otherwise>
		</c:choose>

		<c:forEach begin="${value.startPageNo}" end="${value.endPageNo}" var="pg">
			<li class="paginate_button page-item ${value.pageNo eq pg ? ' active' : ''}"><a href="?pageNo=${pg}&searchType=${value.searchType}&searchValue=${value.searchValue}&sortType=${value.sortType}&sortValue=${value.sortValue}&statusType=${value.statusType != null ? value.statusType : ''}" aria-controls="bootstrap-data-table" data-dt-idx="3" tabindex="0" class="page-link">${pg}</a></li>
		</c:forEach>

		<c:choose>
			<c:when test="${value.pageNo lt value.nextPageNo}">
				<li class="paginate_button page-item next" id="bootstrap-data-table_next"><a href="?pageNo=${value.nextPageNo}&searchType=${value.searchType}&searchValue=${value.searchValue}&sortType=${value.sortType}&sortValue=${value.sortValue}&statusType=${value.statusType != null ? value.statusType : ''}" aria-controls="bootstrap-data-table" class="page-link">Next</a></li>
			</c:when>
			<c:otherwise>
				<li class="paginate_button page-item next" id="bootstrap-data-table_next"><a href="javascript:void(0)" aria-controls="bootstrap-data-table" class="page-link">Next</a></li>
			</c:otherwise>
		</c:choose>
	</ul>
</div>