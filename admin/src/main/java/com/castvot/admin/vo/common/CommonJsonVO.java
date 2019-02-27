package com.castvot.admin.vo.common;

import com.castvot.admin.common.ResultType;
import jdk.nashorn.internal.objects.annotations.Setter;
import lombok.Data;

/**
 * JSON RESULT
 *
 * @author [개발] 한정기
 * @since 2018-01-30
 */
@Data
public class CommonJsonVO {

    private int    code;
    private Object data;
    private String msg;

    public CommonJsonVO() {

        this.code = ResultType.SUCCESS.getCode();
        this.msg = ResultType.SUCCESS.getMsg();
    }

    public CommonJsonVO( ResultType code ) {

        this.code = code.getCode();
        this.msg = code.getMsg();
    }

    public CommonJsonVO( ResultType code, Object data ) {

        this.code = code.getCode();
        this.msg = code.getMsg();
        this.data = data;
    }

    public CommonJsonVO( ResultType code, Object data, String message ) {

        this.code = code.getCode();
        this.msg = message;
        this.data = data;
    }

    public CommonJsonVO( Object data ) {

        this.code = ResultType.SUCCESS.getCode();
        this.msg = ResultType.SUCCESS.getMsg();
        this.data = data;
    }

    @Setter
    public void setCode( ResultType code ) {

        this.code = code.getCode();
        this.msg = code.getMsg();
    }


}
