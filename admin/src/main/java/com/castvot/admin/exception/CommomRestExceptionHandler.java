package com.castvot.admin.exception;


import com.castvot.admin.common.ResultType;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

@RestControllerAdvice
public class CommomRestExceptionHandler {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	/**
	 * <pre>
	 *  exception 공통 처리  
	 * <pre>
	 * @methodName  errorPage
	 * @author		jk.han
	 * @date		2017. 12. 27.
	 * @returnType	String
	 */
	@ExceptionHandler(Exception.class)
	public CommonJsonVO handleException( Exception e, WebRequest req){
		logger.error(e.getMessage(), e);
		loggingStackTrace(e.getStackTrace());
		return new CommonJsonVO( ResultType.SERVER_ERROR );
	}
	
	private void loggingStackTrace(StackTraceElement[] stackTraceElements){
		StringBuffer messageSB = new StringBuffer();
		for(int i = 0; i < stackTraceElements.length; i++){
			messageSB
				.append(stackTraceElements[i].getClassName())
				.append(".")
				.append(stackTraceElements[i].getMethodName())
				.append("(" + stackTraceElements[i].getLineNumber() + ")")
				.append("\n");
		}
		logger.error(messageSB.toString());
	}
	
}
