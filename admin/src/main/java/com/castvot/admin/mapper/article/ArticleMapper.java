package com.castvot.admin.mapper.article;

import com.castvot.admin.vo.article.ArticleParam;
import com.castvot.admin.vo.article.ArticleVO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleMapper {

    List<ArticleVO> selectBoardList( ArticleParam articleParam );

    int selectBoardCnt( ArticleParam articleParam );

    ArticleVO selectBoard( ArticleParam articleParam );

    int insertBoard( ArticleParam articleParam );

    int updateBoard( ArticleParam articleParam );

    int deleteBoard( ArticleParam articleParam );

}
