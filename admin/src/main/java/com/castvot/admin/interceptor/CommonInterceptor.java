package com.castvot.admin.interceptor;

import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

public class CommonInterceptor implements HandlerInterceptor{

	Logger logger = LoggerFactory.getLogger(this.getClass());
	
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)throws Exception {
		
		logger.info("--------------------------------------------");
		logger.info("request URI : {}", request.getRequestURI());
		Map<String, String[]> params = request.getParameterMap();
		
		for (Entry<String, String[]> item : params.entrySet()) {
			for (String value : item.getValue()) {
				logger.info("{}", " KEY : "+ item.getKey() + ", VALUE : " + value);
			}
		}
		
		logger.info("--------------------------------------------");
		
		request.setAttribute("currentMillTime", System.currentTimeMillis());
		return true;

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)	throws Exception {
		// TODO Auto-generated method stub
		
	}

}