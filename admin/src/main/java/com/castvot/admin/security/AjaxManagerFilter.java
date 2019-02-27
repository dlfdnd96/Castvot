package com.castvot.admin.security;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Set;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.castvot.admin.common.CommonVariable;
import com.castvot.admin.common.ResultType;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;

@Repository
public class AjaxManagerFilter implements Filter {

    @Override
    public void init( FilterConfig filterConfig ) throws ServletException {
        // TODO Auto-generated method stub

    }

    @Override
    public void doFilter( ServletRequest req, ServletResponse res, FilterChain chain ) throws IOException, ServletException {

        HttpServletRequest request = ( HttpServletRequest ) req;
        HttpServletResponse response = ( HttpServletResponse ) res;

        String path = request.getRequestURI();

        // 미로그인 ajax 호출시 필터 처리 추가 - jk.han
        if ( path.indexOf( "/ajax/" ) > -1 && path.indexOf( "/ajax/member" ) == -1 ) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Set < String > roles = AuthorityUtils.authorityListToSet( authentication.getAuthorities() );
            if ( roles.contains( CommonVariable.USER_AUTHORITY_ANONYMOUS ) ) {
                ObjectMapper om = new ObjectMapper();
                CommonJsonVO result = new CommonJsonVO();

                result.setCode( ResultType.SERVER_ERROR );
                String jsonString = om.writeValueAsString( result );
                OutputStream out = response.getOutputStream();
                out.write( jsonString.getBytes() );
            } else {
                chain.doFilter( req, res );
            }
        } else {
            chain.doFilter( req, res );
        }
    }

    @Override
    public void destroy() {
        // TODO Auto-generated method stub

    }

}
