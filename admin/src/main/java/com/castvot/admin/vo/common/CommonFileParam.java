package com.castvot.admin.vo.common;

import com.castvot.admin.common.FileType;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * 파일 업로드 PVO
 *
 * @author [개발] 한정기
 * @since 2018-01-31
 */
@Data
@Accessors(chain = true)
public class CommonFileParam {
    
    /** 업로드 파일 */
	private MultipartFile file;
	
	/** 저장 경로 */
	private String savePath;					
	
	/** 썸네일 생성여부 */
	private boolean isThumbNail;		
	
	/** 비디오 썸네일 생성 여부 */
	private boolean isVideoThumbNail;
	
	/**
	 * 썸네일 생성 사이즈
	 */
	private int thumbNailSize [] = {220, 280};
	
	/**
	 * 업로드 허용 파일타입 -> 없을시 모든 파일 타입에서 서치
	 */
	private FileType uploadFileType;
	
	/**
	 * 업로드 제한 사이즈 -> 없을시 properties 에 설정값으로 기준
	 */
	private long maxFileSize;
	
	/** 파일명 접두사 */
	private String prefixFileName;
	
	/** 전체 허용시 특정 파일 타입 제외값 */
	private FileType excludeFileType;
	
	/** 이미지 1:1 Center 크로핑 필요여부 */
	private boolean isImageCenterCroping;
	
	/** 동영상 프레임 캡쳐(1:1 center 기준) 여부 */
	private boolean isFrameCenterCroping;
}
