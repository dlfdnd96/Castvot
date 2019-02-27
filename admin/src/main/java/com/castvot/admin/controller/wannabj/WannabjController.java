package com.castvot.admin.controller.wannabj;

import com.castvot.admin.service.wannabj.WannabjServiceImpl;
import com.castvot.admin.variable.code.CandidateCode;
import com.castvot.admin.variable.code.WannabjCode;
import com.castvot.admin.vo.wannabj.WannabjParam;
import com.castvot.admin.vo.wannabj.WannabjVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping( "/wannabj" )
public class WannabjController {

    @Autowired
    WannabjServiceImpl wannabjService;

    @Value( "${image.s3.domain}" )
    String url;

    /**
     * 후보 관리 페이지
     *
     * @return
     */
    @RequestMapping( "/list" )
    public ModelAndView manager( WannabjParam wannabjParam ) {

        List < WannabjVO > wannabjVOList = wannabjService.getWannabj( wannabjParam );

        ModelAndView view = new ModelAndView();
        view.setViewName( "wannabj/list" );
        view.addObject( "wannabjVOList", wannabjVOList );
        view.addObject( "wannabjParam", wannabjParam );
        view.addObject( "wannabjPaging", wannabjParam );
        view.addObject( "wannabjCode", WannabjCode.STATUS.values() );

        return view;

    }

    /**
     * 상세
     * @return
     */
    @RequestMapping( "/detail" )
    public ModelAndView detail ( WannabjParam wannabjParam ) {

        ModelAndView view = new ModelAndView();
        WannabjVO wannabjVO = wannabjService.getWannabjOne( wannabjParam );
        view.setViewName( "wannabj/detail" );
        view.addObject( "wannabjVO", wannabjVO );
        view.addObject( "wannabjCoinList", wannabjVO.getCoinList() );

        return view;

    }

    /**
     * 상세
     * @return
     */
    @RequestMapping( "/detailUpdate" )
    public ModelAndView detailUpdate ( WannabjParam wannabjParam ) {

        ModelAndView view = new ModelAndView();
        WannabjVO wannabjVO = wannabjService.getWannabjOne( wannabjParam );
        view.setViewName( "wannabj/detailUpdate" );
        view.addObject( "wannabjVO", wannabjVO );
        view.addObject( "wannabjCoinList", wannabjVO.getCoinList() );

        return view;

    }



}
