package com.castvot.admin.config;

import javax.servlet.FilterRegistration;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

import org.springframework.web.WebApplicationInitializer;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.filter.CharacterEncodingFilter;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.filter.HiddenHttpMethodFilter;
import org.springframework.web.multipart.support.MultipartFilter;
import org.springframework.web.servlet.DispatcherServlet;

import com.navercorp.lucy.security.xss.servletfilter.XssEscapeServletFilter;
import com.opensymphony.sitemesh.webapp.SiteMeshFilter;

public class WebAppInitializer implements WebApplicationInitializer {

    private static final String FILTER_MAPPING_URL_PATTERNS = "/*";
    private static final String CONFIG_LOCATION = "com.castvot.admin";
    private static final String DISPLAY_NAME = "castvot";


    @Override
    public void onStartup( ServletContext servletContext ) throws ServletException {

        // Root Context
        AnnotationConfigWebApplicationContext rootContext = new AnnotationConfigWebApplicationContext();

        rootContext.setDisplayName( DISPLAY_NAME );
        rootContext.setConfigLocation( CONFIG_LOCATION );

        servletContext.addListener( new ContextLoaderListener( rootContext ) );

        addDispatcherServlet( servletContext, rootContext );
        addEncodingFileter( servletContext );
        addXssEscapeServletFilter( servletContext );
        addSpringSecurityFilter( servletContext );
        addHttpMethodFilter( servletContext );
        addSiteMeshFilter( servletContext );

    }

    /**
     * DispatcherServlet 등록
     *
     * @param servletContext        ServletContext
     * @param webApplicationContext WebApplicationContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addDispatcherServlet( ServletContext servletContext, WebApplicationContext webApplicationContext ) {

        ServletRegistration.Dynamic registration = servletContext.addServlet( "dispatcher", new DispatcherServlet( webApplicationContext ) );

        registration.setLoadOnStartup( 1 );
        registration.addMapping( "/" );
    }

    // ============================================================
    // 필터 등록 메서드
    // ============================================================

    /**
     * 인코딩 필터 등록
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addEncodingFileter( ServletContext servletContext ) {

        FilterRegistration registration = servletContext.addFilter( "characterEncodingFilter", CharacterEncodingFilter.class );

        registration.setInitParameter( "encoding", "UTF-8" );
        registration.setInitParameter( "forceEncoding", "true" );
        registration.addMappingForUrlPatterns( null, false, FILTER_MAPPING_URL_PATTERNS );
    }

    /**
     * HTTP 메서드 필터 등록
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addHttpMethodFilter( ServletContext servletContext ) {

        FilterRegistration registration = servletContext.addFilter( "httpMethodFilter", HiddenHttpMethodFilter.class );

        registration.addMappingForUrlPatterns( null, false, FILTER_MAPPING_URL_PATTERNS );
    }

    /**
     * 멀티파트 분리를 위한 필터 등록
     * ( 분리하지않을시 루시필터 지원 안함 )
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addMultipartFilter( ServletContext servletContext ) {

        FilterRegistration registration = servletContext.addFilter( "multipartFilter", MultipartFilter.class );

        registration.setInitParameter( "multipartResolverBeanName", "multipartResolver" );
        registration.addMappingForUrlPatterns( null, false, FILTER_MAPPING_URL_PATTERNS );
    }

    /**
     * XSS 방어 필터 등록
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addXssEscapeServletFilter( ServletContext servletContext ) {

        FilterRegistration registration = servletContext.addFilter( "xssEscapeServletFilter", XssEscapeServletFilter.class );

        registration.addMappingForUrlPatterns( null, false, FILTER_MAPPING_URL_PATTERNS );
    }

    /**
     * 스프링 시큐리티 필터 등록
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addSpringSecurityFilter( ServletContext servletContext ) {

        FilterRegistration registration = servletContext.addFilter( "springSecurityFilterChain", DelegatingFilterProxy.class );

        registration.addMappingForUrlPatterns( null, false, FILTER_MAPPING_URL_PATTERNS );
    }

    /**
     * SiteMesh 필터 등록
     *
     * @param servletContext ServletContext
     * @author [개발] 한정기
     * @since 2018-01-01
     */
    protected void addSiteMeshFilter( ServletContext servletContext ) {

        /*FilterRegistration registration = servletContext.addFilter( "siteMeshFilter", SiteMeshFilter.class );*/
        servletContext.setInitParameter("sitemesh.configfile", "/WEB-INF/config/sitemesh/sitemesh.xml");
        servletContext.addFilter("sitemesh", SiteMeshFilter.class).addMappingForUrlPatterns(null, false, FILTER_MAPPING_URL_PATTERNS);

    }

}
