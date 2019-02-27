package com.castvot.admin.security;

import java.util.HashMap;

import com.castvot.admin.mapper.MemberMapper;
import com.castvot.admin.vo.member.UserVO;
import com.castvot.admin.vo.param.LoginParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

@Repository
public class CustomAuthenticationProvider implements AuthenticationProvider {

    //private static final Logger logger = LoggerFactory.getLogger(CustomAuthenticationProvider.class);
    @Autowired
    MemberMapper memberMapper;

    @Override
    public boolean supports( Class < ? > authentication ) {

        return authentication.equals( UsernamePasswordAuthenticationToken.class );
    }

    @Override
    public Authentication authenticate( Authentication authentication ) throws AuthenticationException {

        String userId = ( String ) authentication.getPrincipal();
        String password = ( String ) authentication.getCredentials();

        //logger.info("사용자가 입력한 로그인정보입니다. {}", userId + "/" + userPw);

        LoginParam loginParam = new LoginParam();
        loginParam.setUserId( userId );
        loginParam.setPassword( password );

        // 회원 조회
        UserVO userVO = memberMapper.selectMember( loginParam );

        if ( userVO == null ) {
            throw new BadCredentialsException( "User Not Found" );
        }

        // 비밀 번호 검증
        if ( !BCrypt.checkpw( loginParam.getPassword(), userVO.getPassword() ) ) {
            throw new BadCredentialsException( "Bad Credentials" );
        }

        UsernamePasswordAuthenticationToken result = new UsernamePasswordAuthenticationToken( userVO.getId(), userVO.getPassword(), userVO.getAuthorities() );
        result.setDetails( userVO );

        return result;
    }
}
