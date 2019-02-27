package com.castvot.admin.security;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.castvot.admin.common.ResultType;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class LoginFailureHandler implements AuthenticationFailureHandler {

    /**
     * <pre>
     * 	로그인 실패시 처리 핸들러 ( excption )
     * <pre>
     * @methodName onAuthenticationFailure
     * @author jk.han
     * @date 2017. 4. 10.
     * @returnType void
     */
    @Override
    public void onAuthenticationFailure( HttpServletRequest request,
                                         HttpServletResponse response, AuthenticationException exception )
            throws IOException, ServletException {

        ObjectMapper om = new ObjectMapper();
        CommonJsonVO result = new CommonJsonVO();

        result.setCode( ResultType.LOGIN_FAIL );
        result.setData( exception );

        String jsonString = om.writeValueAsString( result );
        OutputStream out = response.getOutputStream();
        out.write( jsonString.getBytes() );

    }

}