package com.castvot.admin.controller.article;

import com.castvot.admin.service.article.ArticleServiceImpl;
import com.castvot.admin.vo.article.ArticleParam;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping( "/api/board" )
public class ArticleRestController {

    @Autowired
    ArticleServiceImpl articleService;

    /**
     * 공지사항 등록
     *
     * @return
     */
    @RequestMapping( "/register" )
    public CommonJsonVO register( ArticleParam articleParam )  throws  Exception {

        return articleService.registerBoard( articleParam );

    }

    /**
     * 공지사항 삭제
     *
     * @return
     */
    @RequestMapping( "/remove" )
    public CommonJsonVO remove(ArticleParam articleParam ) {

        return articleService.removeBoard( articleParam );

    }

    /**
     * 공지사항 상세 페이지에서 수정
     *
     * @return
     */
    @RequestMapping( "/update" )
    public CommonJsonVO update( ArticleParam articleParam ) throws Exception {

        return articleService.update( articleParam );

    }

}
