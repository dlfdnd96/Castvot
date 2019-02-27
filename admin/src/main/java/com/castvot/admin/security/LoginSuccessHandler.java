package com.castvot.admin.security;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    /**
     * <pre>
     * 	로그인 성공후 핸들러 ( json 형태 전달처리 )
     * <pre>
     * @methodName onAuthenticationSuccess
     * @author jk.han
     * @date 2017. 4. 6.
     * @returnType void
     */
    @Override
    public void onAuthenticationSuccess( HttpServletRequest request,
                                         HttpServletResponse response, Authentication authentication ) throws IOException,
            ServletException {

        ObjectMapper om = new ObjectMapper();
        CommonJsonVO result = new CommonJsonVO();

        // 세션에 유저정보 저장
        HttpSession session = request.getSession();
        session.setAttribute( "userInfo", authentication.getDetails() );

        result.setData( authentication.getDetails() );
        String jsonString = om.writeValueAsString( result );
        OutputStream out = response.getOutputStream();
        out.write( jsonString.getBytes() );
    }

}
