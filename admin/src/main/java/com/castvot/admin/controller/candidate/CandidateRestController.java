package com.castvot.admin.controller.candidate;

import com.castvot.admin.service.candidate.CandidateServiceImpl;
import com.castvot.admin.vo.candidate.CandidateParam;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping( "/api/candidate" )
public class CandidateRestController {

    @Autowired
    CandidateServiceImpl candidateService;

    @RequestMapping( "/status" )
    public CommonJsonVO statusChange( CandidateParam candidateParam ) throws IOException {

        CommonJsonVO result = candidateService.updateStatus( candidateParam );
        return result;

    }

    @RequestMapping( "/remove" )
    public  CommonJsonVO remove( CandidateParam candidateParam ) {
        return candidateService.removeCandidate( candidateParam );
    }

    @RequestMapping("/update")
    public  CommonJsonVO update( CandidateParam candidateParam ) throws Exception {
        return candidateService.update( candidateParam );
    }

}
