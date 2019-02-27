package com.castvot.admin.vo;

/**
 * BannedWord Param VO
 * @filename BannedWordPVO.java
 * @author ssong
 */
public class PagingVO {

    private static int DEFAULT_PAGE_SIZE = 20;

    private int pageIndex;        // 게시글 번호
    private int pageSize;           // 게시 글 수
    private int firstPageNo;       // 첫 번째 페이지 번호
    private int prevPageNo;      // 이전 페이지 번호
    private int startPageNo;      // 시작 페이지 (페이징 네비 기준)
    private int pageNo;             // 현재 페이지 번호
    private int endPageNo;       // 끝 페이지 (페이징 네비 기준)
    private int nextPageNo;      // 다음 페이지 번호
    private int finalPageNo;      // 마지막 페이지 번호
    private int totalCount;        // 게시 글 전체 수

    public static int getDEFAULT_PAGE_SIZE() {
        return DEFAULT_PAGE_SIZE;
    }
    public static void setDEFAULT_PAGE_SIZE(int dEFAULT_PAGE_SIZE) {
        DEFAULT_PAGE_SIZE = dEFAULT_PAGE_SIZE;
    }
    public int getPageIndex() {
        return pageIndex;
    }
    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }
    public int getPageSize() {
        return pageSize;
    }
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
    public int getFirstPageNo() {
        return firstPageNo;
    }
    public void setFirstPageNo(int firstPageNo) {
        this.firstPageNo = firstPageNo;
    }
    public int getPrevPageNo() {
        return prevPageNo;
    }
    public void setPrevPageNo(int prevPageNo) {
        this.prevPageNo = prevPageNo;
    }
    public int getStartPageNo() {
        return startPageNo;
    }
    public void setStartPageNo(int startPageNo) {
        this.startPageNo = startPageNo;
    }
    public int getPageNo() {
        return pageNo;
    }
    public void setPageNo(int pageNo) {
        this.pageNo = pageNo;
    }
    public int getEndPageNo() {
        return endPageNo;
    }
    public void setEndPageNo(int endPageNo) {
        this.endPageNo = endPageNo;
    }
    public int getNextPageNo() {
        return nextPageNo;
    }
    public void setNextPageNo(int nextPageNo) {
        this.nextPageNo = nextPageNo;
    }
    public int getFinalPageNo() {
        return finalPageNo;
    }
    public void setFinalPageNo(int finalPageNo) {
        this.finalPageNo = finalPageNo;
    }
    public int getTotalCount() {
        return totalCount;
    }
    /**
     * @param totalCount the totalCount to set
     */
    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
        this.makePaging();
    }

    /**
     * 페이징 생성
     */
    private void makePaging() {
        int pagingCnt = 5;                      //페이지노출갯수 < 1 2 3 4 5 >
        if (pageNo <= 0) pageNo = 1;
        if (pageSize <= 0) pageSize = DEFAULT_PAGE_SIZE;
        if (endPageNo <= 0) endPageNo = 1;

        firstPageNo = 1;
        finalPageNo = (totalCount + (pageSize - 1)) / pageSize; // 마지막 페이지
        if(finalPageNo <= 0) {
            finalPageNo = 1;
        }

        if (pageNo > finalPageNo) pageNo = finalPageNo; // 기본 값 설정
        if(pageNo <= 1){
            pageIndex = 0;
        }else{
            pageIndex = (pageNo - 1) * pageSize;
        }

        startPageNo = ((pageNo - 1) / pagingCnt) * pagingCnt + 1; // 시작 페이지 (페이징 네비 기준)
        endPageNo = startPageNo + pagingCnt - 1; // 끝 페이지 (페이징 네비 기준)

        if (endPageNo > finalPageNo) { // [마지막 페이지 (페이징 네비 기준) > 마지막 페이지] 보다 큰 경우
            endPageNo = finalPageNo;
        }

        prevPageNo = (pageNo == 1 ? 1 : pageNo - 1);
        nextPageNo = (pageNo == finalPageNo ? finalPageNo : pageNo + 1);
    }

}
