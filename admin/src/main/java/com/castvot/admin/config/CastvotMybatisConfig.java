package com.castvot.admin.config;

import java.io.IOException;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@MapperScan(
        sqlSessionFactoryRef = "sqlSessionFactoryBean",
        basePackages = "com.castvot.admin.mapper"
)
@PropertySource( "classpath:properties/${spring.profiles.active}/jdbc.properties" )
public class CastvotMybatisConfig {

    @Resource( name = "castvotDbDataSource" )
    private DataSource castvotDbDataSource;

    // sqlbean factory 등록 mybatis 설정등록
    @Bean( name = "sqlSessionFactoryBean" )
    public SqlSessionFactoryBean sqlSessionFactoryBean( ApplicationContext applicationContext ) throws IOException {

        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
        factoryBean.setDataSource( castvotDbDataSource );
        factoryBean.setConfigLocation( applicationContext.getResource( "classpath:/config/mapper/sql-mapper-config.xml" ) );
        factoryBean.setMapperLocations( applicationContext.getResources( "classpath:/config/mapper/*/*.xml" ) );

        return factoryBean;

    }

}
