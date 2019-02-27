package com.castvot.admin.vo.param;

import com.castvot.admin.vo.PagingVO;

public class MessagePVO extends PagingVO {
    private long id;                                             //메시지 저장 ID
    private long roomId;                                     //채팅방 ID
    private long contentId;                                 //채팅방 컨텐츠 아이디
    private String contentType;                           // 컨텐츠타입 (쿠차, 피키 , 피키/쿠차 , - )
    private String username;                                // 메시지 전송 유저
    private String nickname;                                // 메시지 전송 유저 닉네임
    private String userProfileUrl;                           // 메시지 전송 유저 프로필 주소
    private String content;                                     //전송 메시지
    private String type;                                          //메시지 타입 ( NOTI, COMMON )
    private String textType;                                   // 메시지 텍스트타입 (일반텍스트 , 링크 텍스트 )
    private String sendDt;                                      //전송 시간
    private String deleteYn;                                    //삭제여부
    private String messageId;                               // 메시지 고유 아이디
    private String createDt;                                    // 생성일
    public long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }
    public long getRoomId() {
        return roomId;
    }
    public void setRoomId(long roomId) {
        this.roomId = roomId;
    }
    public long getContentId() {
        return contentId;
    }
    public void setContentId(long contentId) {
        this.contentId = contentId;
    }
    public String getContentType() {
        return contentType;
    }
    public void setContentType(String contentType) {
        this.contentType = contentType;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getNickname() {
        return nickname;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }
    public String getUserProfileUrl() {
        return userProfileUrl;
    }
    public void setUserProfileUrl(String userProfileUrl) {
        this.userProfileUrl = userProfileUrl;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getTextType() {
        return textType;
    }
    public void setTextType(String textType) {
        this.textType = textType;
    }
    public String getSendDt() {
        return sendDt;
    }
    public void setSendDt(String sendDt) {
        this.sendDt = sendDt;
    }
    public String getDeleteYn() {
        return deleteYn;
    }
    public void setDeleteYn(String deleteYn) {
        this.deleteYn = deleteYn;
    }
    public String getMessageId() {
        return messageId;
    }
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    public String getCreateDt() {
        return createDt;
    }
    public void setCreateDt(String createDt) {
        this.createDt = createDt;
    }

}
