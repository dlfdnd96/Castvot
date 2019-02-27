<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ include file="/WEB-INF/views/layout/include/incTaglib.jsp" %>
<spring:eval var="UPLOAD_URL" expression="@environment['image.s3.domain']" scope="request"/>

