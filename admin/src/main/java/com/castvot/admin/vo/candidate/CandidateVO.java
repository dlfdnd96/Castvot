package com.castvot.admin.vo.candidate;

import com.castvot.admin.variable.code.CandidateCode;
import lombok.Data;

import java.sql.Timestamp;
import java.util.List;

@Data
public class CandidateVO {

    private long                     pk;
    private Timestamp                cdate;
    private Timestamp                mdate;
    private String                   recommender;
    private String                   boyManagement;
    private int                      boyBirthYear;
    private int                      boyBirthMonth;
    private int                      boyBirthDate;
    private int                      bfcSeasonNumber;
    private CandidateCode.STATUS     status;
    private CandidateCode.BLOOD_TYPE boyBloodType;
    private long                     userPk;
    private String                   boyName;
    private String                   boySns;
    private boolean                  publicAgree;
    private String                   reason;
    private String                   photo1;
    private String                   photo2;
    private String                   photo3;
    private String                   xrpAccount;
    private String                   qtumAccount;
    private String                   userName;

    private List< CoinAccountVO >    coinList;


}
