package com.castvot.admin.common;

public class CommonVariable {

    // 유저권한
    public static final String USER_AUTHORITY_ANONYMOUS = "ROLE_ANONYMOUS";                // 비인증
    public static final String USER_AUTHORITY_ADMIN     = "ROLE_ADMIN";                        // 관리자
    public static final String USER_AUTHORITY_STAFF     = "ROLE_EDITOR";                    // 에디터
    public static final String USER_AUTHORITY           = "ROLE_USER";                            // 스태프 & 일반유저

    // 파일 확장자 타입
    public static final String FILE_TYPES = "JPG, PNG, JPEG, BMP";                        // 파일 확장자

    // 구분 파일타입
    public static final String FILE_TYPE_EMOJI = "emoji";                                // 이모티콘
    public static final String FILE_TYPE_ADMIN = "admin";                                // 관리자 프로필

}
