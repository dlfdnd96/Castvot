package com.castvot.admin.vo.common;

import lombok.Data;

/**
 * 공통 페이징 파라미터
 *
 * @author [개발] 한정기
 * @since 2018-01-01
 */
@Data
public class CommonPagingParam {

    /** 기본 게시글 수 */
    public static int DEFAULT_PAGE_SIZE = 20;

    /** 기본 페이지 수 */
    public static int DEFAULT_PAGING_COUNT = 5;

    private int pageIndex;   // 게시글 번호
    private int pageSize;    // 게시글 수
    private int firstPageNo; // 첫 번째 페이지 번호
    private int prevPageNo;  // 이전 페이지 번호
    private int startPageNo; // 시작 페이지 (페이징 네비 기준)
    private int pageNo;      // 현재 페이지 번호
    private int endPageNo;   // 끝 페이지 (페이징 네비 기준)
    private int nextPageNo;  // 다음 페이지 번호
    private int finalPageNo; // 마지막 페이지 번호
    private int totalCount;  // 게시글 전체 수

    public void setTotalCount( int totalCount ) {

        this.totalCount = totalCount;
        this.makePaging();
    }

    /**
     * 페이징 생성
     */
    private void makePaging() {

        int pagingCnt = DEFAULT_PAGING_COUNT; // 페이지노출갯수 < 1 2 3 4 5 >

        if ( pageNo <= 0 ) pageNo = 1;
        if ( pageSize <= 0 ) pageSize = DEFAULT_PAGE_SIZE;
        if ( endPageNo <= 0 ) endPageNo = 1;

        firstPageNo = 1;
        finalPageNo = ( totalCount + ( pageSize - 1 ) ) / pageSize; // 마지막 페이지
        if ( finalPageNo <= 0 ) {
            finalPageNo = 1;
        }

        if ( pageNo > finalPageNo ) pageNo = finalPageNo; // 기본 값 설정
        if ( pageNo <= 1 ) {
            pageIndex = 0;
        } else {
            pageIndex = ( pageNo - 1 ) * pageSize;
        }

        startPageNo = ( ( pageNo - 1 ) / pagingCnt ) * pagingCnt + 1; // 시작 페이지 (페이징 네비 기준)
        endPageNo = startPageNo + pagingCnt - 1; // 끝 페이지 (페이징 네비 기준)

        if ( endPageNo > finalPageNo ) { // [마지막 페이지 (페이징 네비 기준) > 마지막 페이지] 보다 큰 경우
            endPageNo = finalPageNo;
        }

        prevPageNo = ( pageNo == 1 ? 1 : pageNo - 1 );
        nextPageNo = ( pageNo == finalPageNo ? finalPageNo : pageNo + 1 );
    }

}
