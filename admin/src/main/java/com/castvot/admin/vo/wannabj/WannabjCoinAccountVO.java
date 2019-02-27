package com.castvot.admin.vo.wannabj;

import com.castvot.admin.variable.code.CandidateCode;
import lombok.Data;

@Data
public class WannabjCoinAccountVO {

    private long                    pk;
    private long                    bjPk;
    private CandidateCode.COIN_TYPE coinType;
    private String                  account;
    private String                  secret;

}
