package com.castvot.admin.config;

import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Configuration
@PropertySource( "classpath:properties/${spring.profiles.active}/jdbc.properties" )
public class DataSourceConfig {

    @Autowired
    private Environment evn;

    @Bean( name = "castvotDbDataSource" )
    public DataSource basicDataSource() {

        BasicDataSource dataSource = new BasicDataSource();

        dataSource.setDriverClassName( evn.getProperty( "jdbc.castvot.driver" ) );
        dataSource.setUrl( evn.getProperty( "jdbc.castvot.jdbcUrl" ) );
        dataSource.setUsername( evn.getProperty( "jdbc.castvot.username" ) );
        dataSource.setPassword( evn.getProperty( "jdbc.castvot.password" ) );

        dataSource.setDefaultAutoCommit( false );
        dataSource.setValidationQuery( "SELECT 1" );
		/*
		dataSource.setMinIdle(0);
		dataSource.setMaxConnLifetimeMillis(10);
		dataSource.setTimeBetweenEvictionRunsMillis(5000);
		dataSource.setTestOnBorrow(true);
		dataSource.setTestWhileIdle(true);
		dataSource.setNumTestsPerEvictionRun(3);
		dataSource.setMinEvictableIdleTimeMillis(10);
		*/

        return dataSource;

    }

}
