package com.castvot.admin.config;

import com.castvot.admin.security.AjaxManagerFilter;
import com.castvot.admin.security.CustomAuthenticationProvider;
import com.castvot.admin.security.LoginFailureHandler;
import com.castvot.admin.security.LoginSuccessHandler;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

import javax.annotation.Resource;

/**
 * 보안 설정
 *
 * @author [개발] 한정기
 * @since 2018-01-01
 */
@Configuration
@EnableWebMvcSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Resource
    private LoginSuccessHandler loginSuccessHandler;

    @Resource
    private LoginFailureHandler loginFailureHandler;

    @Resource
    private CustomAuthenticationProvider customAuthenticationProvider;

    // ============================================================
    // WebSecurityConfigurerAdapter 상속 메서드
    // ============================================================

    /**
     * {@inheritDoc}
     *
     * @author [개발] 한정기
     * @since 2018-02-14
     */
    @Override
    public void configure( WebSecurity web ) throws Exception {

        web.ignoring()
                .antMatchers( "/resources/**" )
                .antMatchers( "/favicon.*" );
    }

    /**
     * {@inheritDoc}
     *
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    @Override
    protected void configure( HttpSecurity http ) throws Exception {

        http.httpBasic()
                .and()
                .csrf().disable()
                .httpBasic().and()
                .exceptionHandling()
                .authenticationEntryPoint( new LoginUrlAuthenticationEntryPoint( "/login/loginPage" ) );
        //.addFilterAfter( ajaxManagerFilter, ExceptionTranslationFilter.class );

        // 세션 설정
		/*
		http.sessionManagement()
				.maximumSessions( 1 )
				.expiredUrl( "/login/duplicateLogin" )
		;
		*/

        configLogin( http );
        configAuthorize( http );
    }

    // ============================================================
    // 유틸 메서드
    // ============================================================

    /**
     * 로그인 설정
     *
     * @param http HttpSecurity
     * @throws Exception Exception
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    private void configLogin( HttpSecurity http ) throws Exception {

        // 로그인
        http.authenticationProvider( customAuthenticationProvider )
                .formLogin()
                .loginPage( "/login/loginPage" ).permitAll()
                .loginProcessingUrl( "/login/loginProc" ).permitAll()
                .usernameParameter( "userId" )
                .passwordParameter( "password" )
                .successHandler( loginSuccessHandler )
                .failureHandler( loginFailureHandler )
                .permitAll();

        // 로그아웃
        http.logout()
                .invalidateHttpSession( true )
                .logoutUrl( "/logout" )
                .logoutSuccessUrl( "/login/loginPage" );
    }

    /**
     * 접근제어 설정
     *
     * @param http HttpSecurity
     * @throws Exception Exception
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    private void configAuthorize( HttpSecurity http ) throws Exception {

        http.authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/errorPage").permitAll()
                .antMatchers("/login/**").permitAll()
                .antMatchers("/file/**", "/resources/**").permitAll()
                .anyRequest().authenticated();

    }

}
