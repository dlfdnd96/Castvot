package com.castvot.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

/**
 * 프로퍼티 소스 설정
 *
 * @author [개발] 한정기
 * @since 2018-01-25
 */
@Configuration
public class PropertySourceConfig {

    /**
     * 프로퍼티 플레이스 홀더
     *
     * @return 프로퍼티 플레이스 홀더
     * @author [개발] 한정기
     * @since 2018-01-25
     */
    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        // 플레이스홀더에 등록
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        return configurer;
    }

    /** 로컬 프로퍼티 소스 */
    @Configuration
    @Profile( { "local", "default" } )
    @PropertySource( {
            "classpath:properties/local/jdbc.properties",
            "classpath:properties/local/global.properties"
    } )
    static class LocalProfile {}

    /** 개발 프로퍼티 소스 */
    @Configuration
    @Profile( { "development" } )
    @PropertySource( {
            "classpath:properties/development/jdbc.properties",
            "classpath:properties/development/global.properties"
    } )
    static class DevelopmentProfile {}

    /** 운영 프로퍼티 소스 */
    @Configuration
    @Profile( { "production" } )
    @PropertySource( {
            "classpath:properties/production/jdbc.properties",
            "classpath:properties/production/global.properties"
    } )
    static class ProductionProfile {}

}
