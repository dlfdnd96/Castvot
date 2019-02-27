package com.castvot.admin.controller.article;

import com.castvot.admin.service.article.ArticleServiceImpl;
import com.castvot.admin.vo.article.ArticleParam;
import com.castvot.admin.vo.article.ArticleVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
@RequestMapping( "/board" )
public class ArticleController {

    @Autowired
    ArticleServiceImpl articleService;

    /**
     * 공지사항 페이지
     *
     * @return
     */
    @RequestMapping( "/list" )
    public ModelAndView list( ArticleParam articleParam ) {

        List< ArticleVO > articleVOList = articleService.getBoard( articleParam );

        ModelAndView view = new ModelAndView();
        view.setViewName( "board/list" );
        view.addObject( "articleVOList", articleVOList );
        view.addObject( "articleParam", articleParam );
        view.addObject( "articlePaging", articleParam );

        return view;

    }

    /**
     * 공지사항 상세 페이지
     *
     * @return
     */
    @RequestMapping( "/detail" )
    public ModelAndView detail ( ArticleParam articleParam ) {

        ArticleVO articleVO = articleService.getBoardOne( articleParam );

        ModelAndView view = new ModelAndView();
        view.setViewName( "board/detail" );
        view.addObject( "articleVO", articleVO );

        return view;

    }

    /**
     * 공지사항 작성
     *
     * @return
     */
    @RequestMapping( "/registerEdit" )
    public ModelAndView registerEdit( ArticleParam articleParam ) {

        ModelAndView view = new ModelAndView();
        view.setViewName( "board/registerEdit" );

        return view;

    }

    /**
     * 공지사항 수정 페이지
     *
     * @return
     */
    @RequestMapping( "/detailUpdate" )
    public ModelAndView detailUpdate( ArticleParam articleParam ) {

        ArticleVO articleVO = articleService.getBoardOne( articleParam );

        ModelAndView view = new ModelAndView();
        view.setViewName( "board/detailUpdate" );
        view.addObject( "articleVO", articleVO );

        return view;

    }

}
