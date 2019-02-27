package com.castvot.admin.controller.candidate;

import com.castvot.admin.service.candidate.CandidateServiceImpl;
import com.castvot.admin.variable.code.CandidateCode;
import com.castvot.admin.vo.candidate.CandidateParam;
import com.castvot.admin.vo.candidate.CandidateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping( "/candidate" )
public class CandidateController {

    @Autowired
    CandidateServiceImpl candidateService;

    @Value( "${image.s3.domain}" )
    String url;

    /**
     * 후보 관리 페이지
     *
     * @return
     */
    @RequestMapping( "/list" )
    public ModelAndView manager( CandidateParam candidateParam ) {

        List < CandidateVO > candidateVOList = candidateService.getCandidate( candidateParam );

        ModelAndView view = new ModelAndView();
        view.setViewName( "candidate/list" );
        view.addObject( "candidateVOList", candidateVOList );
        view.addObject( "candidateParam", candidateParam );
        view.addObject( "candidatePaging", candidateParam );
        view.addObject( "candidateCode", CandidateCode.STATUS.values() );

        return view;

    }

    /**
     * 상세
     * @return
     */
    @RequestMapping( "/detail" )
    public ModelAndView detail ( CandidateParam candidateParam ) {

        ModelAndView view = new ModelAndView();
        CandidateVO candidateVO = candidateService.getCandidateOne( candidateParam );
        view.setViewName( "candidate/detail" );
        view.addObject( "candidateVO", candidateVO );
        view.addObject( "coinList", candidateVO.getCoinList() );

        return view;

    }

    /**
     * 상세
     * @return
     */
    @RequestMapping( "/detailUpdate" )
    public ModelAndView detailUpdate ( CandidateParam candidateParam ) {

        ModelAndView view = new ModelAndView();
        CandidateVO candidateVO = candidateService.getCandidateOne( candidateParam );
        view.setViewName( "candidate/detailUpdate" );
        view.addObject( "candidateVO", candidateVO );
        view.addObject( "coinList", candidateVO.getCoinList() );

        return view;

    }



}
