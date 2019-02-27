package com.castvot.admin.controller.wannabj;

import com.castvot.admin.service.wannabj.WannabjServiceImpl;
import com.castvot.admin.vo.common.CommonJsonVO;
import com.castvot.admin.vo.wannabj.WannabjParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping( "/api/wannabj" )
public class WannabjRestController {

    @Autowired
    WannabjServiceImpl wannabjService;

    @RequestMapping( "/status" )
    public CommonJsonVO statusChange( WannabjParam wannabjParam ) throws IOException {

        CommonJsonVO result = wannabjService.updateWannabjStatus( wannabjParam );
        return result;

    }

    @RequestMapping( "/remove" )
    public  CommonJsonVO remove( WannabjParam wannabjParam ) {
        return wannabjService.removeWannabj( wannabjParam );
    }

    @RequestMapping("/update")
    public  CommonJsonVO update( WannabjParam wannabjParam ) throws Exception {
        return wannabjService.updateWannabj( wannabjParam );
    }

}
