package com.castvot.admin.common;

/**
 *
 * result 결과값 정의
 *
 * @author [개발] 한정기
 * @since 2018-01-30
 */
public enum ResultType {

    SERVER_ERROR                    (0, "서버에 문제가 발생했습니다. 관리자에게 문의해주시기 바랍니다."),
    NO_SEARCH_VALUE                 (3, "검색된결과가 없습니다."),
    EXTERNAL_GET_DATA_FAIL          (4, "가져올 외부데이터가 없습니다."),

    LOGIN_FAIL                      (10, "로그인에 실패하셨습니다."),
    PASSWORD_FAIL                   (11, "비밀번호를 입력해 주세요"),
    NOW_PASSWORD_FAIL               (12, "현재 비밀번호가 틀립니다."),
    AFTER_OTHER_PASSWORD            (13, "새로 변경할 패스워드와 재입력 패스워드가 틀립니다."),
    IS_NOT_LOGIN                    (14, "로그인 하실수 없습니다."),
    BEFORE_NICKNAME_IS_SAME         (15, "이전닉네임과 같은 닉네임 입니다."),
    PASSWORD_PATTEN_IS_DIFFERNCE    (16, "비밀번호는 영문/숫자/특수문자 조합에 최소 8자리 최대 15자리로 생성가능합니다."),
    ID_STRING_IS_NOT_USE            (17, "아이디에 일부 사용할수 없는 문자가 포함되어있습니다."),
    REQUIRED_LOGIN                  (18, "로그인이 필요한 서비스입니다."),


    CHAT_ROOMSEQ_IS_NULL            (41, "채팅방키 없음"),
    CHAT_ROOM_CREATE_FAIL           (42, "채팅방 방생성에 실패하셨습니다."),
    CHAT_ROOM_SEARCH_FAIL           (43, "채팅방을 찾을수 없습니다."),
    CHAT_ROOMLIST_FIND_FAIL         (44, "방목록을 찾을수 없습니다."),

    DUPLICATION_ID                  (51, "이미 등록된 아이디 입니다."),
    DUPLICATION_NICKNAME            (52, "이미 등록된 닉네임 입니다."),

    DELETE_FAIL                     (61, "삭제에 실패하였습니다."),
    INSERT_FAIL                     (62, "등록에 실패하였습니다."),
    UPDATE_FAIL                     (63, "수정에 실패하였습니다."),
    SELECT_FAIL                     (64, "검색에 실패하였습니다."),
    VALID_FAIL                      (69, "검증에 실패하였습니다."),

    FILE_IS_NULL                    (71, "파일을 등록해주세요."),
    FILE_SIZE_OVER                  (72, "파일사이즈가 너무 큽니다."),
    CONTENT_TYPE_ERROR              (73, "등록할수 없는 파일 타입 입니다."),
    FILE_INFO_NOT_FOUND             (74, "파일정보를 찾을수 없습니다."),
    FILE_NOT_FOUND                  (75, "파일을 찾을수 없습니다."),
    FILE_TYPE_REJECT                (76, "업로드 할수 없는 파일 타입 입니다."),

    GOODS_MINQTY_FAIL               (81, "구매가능한 최소수량이 아닙니다."),
    GOODS_MAXQTY_FAIL               (82, "구매가능한 최대수량을 초과하였습니다."),
    GOODS_ASKORDER_FAIL             (83, "가격협의 제품입니다."),
    GOODS_BOOKMARK_CNT_FAIL         (84, "상품찜은 100개까지 등록 가능합니다."),
    
    LOGIN_BUYER_ONLY                (91, "바이어 회원에게만 제공되는 기능 입니다."),

    CHAT_GOODS_DELETE_FAIL          (101, "최소 하나의 상품은 가져야 합니다."),
    
    BRAND_REGIST_CNT_FAIL           (111, "등록 가능한 브랜드 개수를 초과하였습니다."),
    BRAND_DELETE_CNT_FAIL           (112, "삭제 가능한 상품 개수를 초과하였습니다."),
    BRAND_BOOKMARK_FAIL             (113, "내 브랜드는 찜을 할 수 없습니다."),
    BRAND_BOOKMARK_CNT_FAIL         (114, "브랜드찜은 100개까지 등록 가능합니다."),

    TRANSLATOR_NOT_SUPPORT          (121, "지원하지 않는 언어 타입입니다."),

    SUCCESS                         (200, "SUCCESS");

    int code;
    String  msg;

    ResultType( int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode () {
        return this.code;
    }

    public String getMsg () {
        return this.msg;
    }

}