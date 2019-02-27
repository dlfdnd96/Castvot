package com.castvot.admin.common;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * 
 * file 확장자 정의
 * 
 * @author [개발] 한정기
 * @since 2018-01-29
 */
public enum FileType {

	IMAGE("이미지", Arrays.asList("JPG", "PNG", "JPEG", "BMP")),
	VIDEO("비디오", Arrays.asList("MP4", "AVI")),
	ETC("기타", Arrays.asList("OCTET-STREAM","PLAIN","HTML","PDF","XML")),

	EMPTY("없음", Collections.emptyList());

	private String title;
	private List<String> typeList;

	FileType( String title, List<String> typeList){
		this.title = title;
		this.typeList = typeList;
	}

	public List<String> getTypeList(){
		return this.typeList;
	}

	/**
	 *
	 * 파일 그룹내 타입 찾기
	 *
	 * @param type
	 * @return boolean
	 * @author [개발] 한정기
	 * @since 2018-01-30
	 */
	public boolean isFileType (String type) {
		return typeList.stream()
					.anyMatch(data -> data.equals(type));

	}

	/**
	 *
	 * 파일 타입 그룹 찾기
	 *
	 * @param type
	 * @return FileType
	 * @author [개발] 한정기
	 * @since 2018-01-30
	 */
	public static FileType findFileType (String type) {
		return Arrays.stream(FileType.values())
				.filter(fileType -> fileType.isFileType(type))
				.findAny()
				.orElse(EMPTY);
	}

}

