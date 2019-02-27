package com.castvot.admin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ResourceBundleMessageSource;

@Configuration

public class MessageSourceConfig {

	@Bean(name = "messageSource")
	public ResourceBundleMessageSource basicMessageSource() {

		ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.addBasenames("messages/message-common");
        messageSource.setUseCodeAsDefaultMessage( true );
		return messageSource;
		
	}

}
