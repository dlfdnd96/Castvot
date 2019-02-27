package com.castvot.admin.vo.wannabj;

import com.castvot.admin.variable.code.WannabjCode;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class WannabjVO {

    private long                     pk;
    private Timestamp                cdate;
    private Timestamp                mdate;
    private String                   bjName;
    private String                   bjContents;
    private String                   bjActiveArea;
    private String                   bjEmail;
    private String                   bjIntroduce;
    private String                   bjPhoto1;
    private String                   bjPhoto2;
    private String                   bjPhoto3;
    private String                   bjPhoto4;
    private String                   bjChannel1;
    private String                   bjChannel2;
    private String                   bjChannel3;
    private String                   bjFanclub;
    private String                   bjHotVideo1;
    private String                   bjHotVideo2;
    private String                   recName;
    private String                   recEmail;
    private int                      recContactNum1;
    private int                      recContactNum2;
    private int                      selfYn;
    private WannabjCode.STATUS       status;
    private long                     userPk;
    private String                   altAccount;
    private String                   qtumAccount;
    private List<WannabjCoinAccountVO>    coinList;

}
