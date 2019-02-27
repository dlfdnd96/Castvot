package com.castvot.admin.vo.candidate;

import com.castvot.admin.variable.code.CandidateCode.COIN_TYPE;
import lombok.Data;

@Data
public class CoinParam {

    private String account;
    private String secret;
    private long boyPk;
    private COIN_TYPE coinType;

}
