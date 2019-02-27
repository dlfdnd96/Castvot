package com.castvot.admin.common;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CommonErrorController {

    /**
     * <pre>
     * 	에러 메세지 및 리다이렉트
     * <pre>
     * @methodName errorPage
     * @author jk.han
     * @date 2017. 12. 27.
     * @returnType String
     */
    @RequestMapping( value = "/errorPage" )
    public String errorPage( HttpServletRequest httpRequest, Model model ) {

        String errorMsg = "";
        int httpErrorCode = getErrorCode( httpRequest );

        switch ( httpErrorCode ) {
            case 400: {
                errorMsg = "Http Error Code: 400. Bad Request";
                break;
            }
            case 401: {
                errorMsg = "Http Error Code: 401. Unauthorized";
                break;
            }
            case 404: {
                errorMsg = "Http Error Code: 404. Resource not found";
                break;
            }
            case 500: {
                errorMsg = "Http Error Code: 500. Internal Server Error";
                break;
            }
        }

        model.addAttribute( "errorMsg", errorMsg );
        return "error/errorPage";
    }

    /**
     * <pre>
     * 	에러 메세지 및 리다이렉트
     * <pre>
     * @methodName getErrorCode
     * @author jk.han
     * @date 2017. 12. 27.
     * @returnType int
     */
    private int getErrorCode( HttpServletRequest httpRequest ) {

        return ( Integer ) httpRequest
                .getAttribute( "javax.servlet.error.status_code" );
    }
}
