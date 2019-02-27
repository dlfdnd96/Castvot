package com.castvot.admin.vo.common;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

/**
 * S3 서비스를 통한 업로드 결과 정보 VO
 * 
 * @author [개발] 김영목
 * @since 2018-03-21
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CommonFileResultVO extends CommonJsonVO {

	private long fileSeq;				// 파일 고유키
	private String originFileName;		// 원본 파일명
	private String fileName;			// 변환된 파일명
	private String contentType;			// 파일 타입
	private String filePath;			// 로드 경로
	private String fullPath;			// 로드 경로 + 파일명

	private Timestamp regDate;

	@JsonIgnore
	private String realPath;			// 실제 저장 경로

	@JsonIgnore
	private String fullRealPath;		// 실제 저장 경로 + 파일명
	
	@JsonIgnore
	private MultipartFile multiPartFile;

}
