package com.castvot.admin.vo.wannabj;

import com.castvot.admin.variable.code.WannabjCode.COIN_TYPE;
import lombok.Data;

@Data
public class WannabjCoinParam {

    private String account;
    private String secret;
    private long bjPk;
    private COIN_TYPE coinType;

}
