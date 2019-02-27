package com.castvot.admin.config;

import java.util.Collections;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.aspectj.lang.annotation.Aspect;
import org.springframework.aop.Advisor;
import org.springframework.aop.aspectj.AspectJExpressionPointcut;
import org.springframework.aop.support.DefaultPointcutAdvisor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.interceptor.MatchAlwaysTransactionAttributeSource;
import org.springframework.transaction.interceptor.RollbackRuleAttribute;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.transaction.interceptor.TransactionInterceptor;

@Configuration
@EnableAspectJAutoProxy
@Aspect
public class TransactionConfig {

    private static final String AOP_POINTCUT_EXPRESSION = "execution(* com.castvot.admin..*ServiceImpl.*(..))";
    private static final String TX_METHOD_NAME          = "*";
    private static final int    TX_METHOD_TIMEOUT       = 3;

    @Autowired
    private PlatformTransactionManager transactionManager;

    @Bean
    DataSourceTransactionManager dataSourceTransactionManager( DataSource dataSource ) {

        DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
        transactionManager.setDataSource( dataSource );

        return transactionManager;

    }

    // 어드바이쓰 설정값 셋팅
    @Bean
    public TransactionInterceptor txAdvice() {

        MatchAlwaysTransactionAttributeSource source = new MatchAlwaysTransactionAttributeSource();
        RuleBasedTransactionAttribute transactionAttribute = new RuleBasedTransactionAttribute();

        // 적용범위
        transactionAttribute.setName( TX_METHOD_NAME );

        // 적용 룰
        transactionAttribute.setRollbackRules( Collections.singletonList( new RollbackRuleAttribute( Exception.class ) ) );

        transactionAttribute.setTimeout( TX_METHOD_TIMEOUT );
        source.setTransactionAttribute( transactionAttribute );
        TransactionInterceptor txAdvice = new TransactionInterceptor( transactionManager, source );
        return txAdvice;

    }

    // tx 어드바이저 셋팅
    @Bean
    public Advisor txAdviceAdvisor() {

        AspectJExpressionPointcut pointcut = new AspectJExpressionPointcut();
        pointcut.setExpression( AOP_POINTCUT_EXPRESSION );
        return new DefaultPointcutAdvisor( pointcut, txAdvice() );
    }

}
