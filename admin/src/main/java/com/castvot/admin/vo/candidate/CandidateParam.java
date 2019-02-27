package com.castvot.admin.vo.candidate;

import com.castvot.admin.variable.code.CandidateCode;
import com.castvot.admin.variable.code.CandidateCode.COIN_TYPE;
import com.castvot.admin.vo.common.CommonSearchParam;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CandidateParam extends CommonSearchParam {


    private MultipartFile photo1;
    private MultipartFile photo2;
    private MultipartFile photo3;

    private String photoName1;
    private String photoName2;
    private String photoName3;

    private String reason;
    private String boyName;
    private String recommender;
    private String boyManagement;

    private int boyBirthYear;
    private int boyBirthMonth;
    private int boyBirthDate;
    private int bfcSeasonNumber;

    private long pk;
    private long [] pks;

    private CandidateCode.STATUS status;
    private CandidateCode.BLOOD_TYPE boyBloodType;

    private COIN_TYPE coinType;

}
