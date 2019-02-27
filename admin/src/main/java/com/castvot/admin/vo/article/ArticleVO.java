package com.castvot.admin.vo.article;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

@Data
public class ArticleVO {

    private long articleNo;
    private long rownum;
    private String title;
    private String content;
    private String writer;
    private Timestamp regDate;
    private Timestamp mdfyDate;
    private int viewCnt;

}
