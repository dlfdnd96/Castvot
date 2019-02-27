package com.castvot.admin.vo.common;

import com.castvot.admin.variable.code.CandidateCode;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * @author [개발] 한정기
 * @since 2018-02-19
 */
@Data
@ToString( callSuper = true )
@EqualsAndHashCode( callSuper = true )
public class CommonSearchParam extends CommonPagingParam {

    private String searchType;     // 검색 기준
    private String searchValue;    // 검색 값

    private String sortType;       // 정렬 기준
    private String sortValue;      // 정렬 값

    private String dateType;       // 날짜 기준
    private String dateStartValue; // 시작 날짜 TODO timezone
    private String dateEndValue;   // 종료 날짜 TODO timezone

    private CandidateCode.STATUS statusType;

}
