package com.castvot.admin.vo.candidate;

import com.castvot.admin.variable.code.CandidateCode;
import lombok.Data;

@Data
public class CoinAccountVO {

    private long                    pk;
    private long                    boyPk;
    private CandidateCode.COIN_TYPE coinType;
    private String                  account;
    private String                  secret;

}
