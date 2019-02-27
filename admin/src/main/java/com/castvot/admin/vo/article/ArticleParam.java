package com.castvot.admin.vo.article;

import com.castvot.admin.vo.common.CommonSearchParam;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

@Data
public class ArticleParam extends CommonSearchParam {

    private String title;
    private String content;
    private String writer;

    private long articleNo;
    private long [] articleNumbers;
    private long viewCnt;
    private long rownum;

    private Timestamp regDate;
    private Timestamp mdfyDate;

//    private MultipartFile Filedata;

}
