package com.castvot.admin.util;

import com.castvot.admin.vo.PagingVO;

/**
 * 페이징 처리
 *
 * @author ssong
 * @filename PagingUtil.java
 */
public class PagingUtil {

    public static String getPagingAjax( PagingVO page ) {

        String htmls = "";

        htmls += "<li class=" + page.getPrevPageNo() + " value=" + page.getPrevPageNo() + ">";
        htmls += "    <a href='javascript:;' aria-label='Previous'>";
        htmls += "        <span aria-hidden='true'>&lt;</span>";
        htmls += "    </a>";
        htmls += "</li>";
        for ( int i = page.getStartPageNo(); i <= page.getEndPageNo(); i++ ) {
            if ( i == page.getPageNo() ) {
                htmls += "<li class='active' value=" + i + "><a href='javascript:;'>" + i + "</a></li>";
            } else {
                htmls += "<li  value=" + i + " ><a href='javascript:;' >" + i + "</a></li>";
            }
        }
        htmls += "<li class=" + page.getNextPageNo() + " value=" + page.getNextPageNo() + ">";
        htmls += "    <a href='javascript:;' aria-label='Next'>";
        htmls += "        <span aria-hidden='true'>&gt;</span>";
        htmls += "    </a>";
        htmls += "</li>";

        return htmls;
    }
}