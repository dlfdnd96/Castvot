package com.castvot.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.InternalResourceViewResolver;
import org.springframework.web.servlet.view.JstlView;

import com.castvot.admin.interceptor.CommonInterceptor;

@Configuration
@EnableWebMvc
@ComponentScan( basePackages = { "com.castvot.admin" } )
public class WebMvcConfig extends WebMvcConfigurerAdapter {

    private static final int CACHE_PERIOD = 86400; // 초단위

    @Override
    public void addFormatters( FormatterRegistry registry ) {

        super.addFormatters( registry );
    }

    //
    @Override
    public void configureDefaultServletHandling( DefaultServletHandlerConfigurer configurer ) {

        configurer.enable();
        super.configureDefaultServletHandling( configurer );
    }

    // 정적 리소스 정의
    @Override
    public void addResourceHandlers( ResourceHandlerRegistry registry ) {

        registry.addResourceHandler( "/resources/**" ).addResourceLocations( "/resources/" ).setCachePeriod( CACHE_PERIOD );
        super.addResourceHandlers( registry );

    }

    // 인터셉터 적용
    @Override
    public void addInterceptors( InterceptorRegistry registry ) {

        // 인터 셉터 추가
        registry.addInterceptor( new CommonInterceptor() );

        super.addInterceptors( registry );
    }

    // 뷰리졸버 설정
    @Bean
    public ViewResolver getViewResolver() {

        InternalResourceViewResolver resolver = new InternalResourceViewResolver();
        resolver.setViewClass( JstlView.class );
        resolver.setPrefix( "/WEB-INF/views/" );
        resolver.setSuffix( ".jsp" );
        return resolver;

    }

    // 멀티파트 리졸버 설정
    @Bean
    public CommonsMultipartResolver multipartResolver() {

        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        resolver.setDefaultEncoding( "utf-8" );
        return resolver;

    }

}
