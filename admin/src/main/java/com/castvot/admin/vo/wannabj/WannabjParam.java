package com.castvot.admin.vo.wannabj;

import com.castvot.admin.variable.code.WannabjCode;
import com.castvot.admin.variable.code.WannabjCode.COIN_TYPE;
import com.castvot.admin.vo.common.CommonSearchParam;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class WannabjParam extends CommonSearchParam {


    private MultipartFile bjPhoto1;
    private MultipartFile bjPhoto2;
    private MultipartFile bjPhoto3;
    private MultipartFile bjPhoto4;

    private String bjPhotoName1;
    private String bjPhotoName2;
    private String bjPhotoName3;
    private String bjPhotoName4;

    private String bjChannel1;
    private String bjChannel2;
    private String bjChannel3;

    private String bjHotVideo1;
    private String bjHotVideo2;

    private String bjName;
    private String bjContents;
    private String bjActiveArea;
    private String bjEmail;
    private String bjIntroduce;
    private String bjFanclub;

    private String recName;
    private String recEmail;

    private int recContactNum1;
    private int recContactNum2;
    private int selfYn;

    private long pk;
    private long [] pks;

    private WannabjCode.STATUS status;

    private COIN_TYPE coinType;

}
