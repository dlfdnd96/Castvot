package com.castvot.admin.service.article;

import com.castvot.admin.common.ResultType;
import com.castvot.admin.mapper.article.ArticleMapper;
import com.castvot.admin.service.aws.AmazonS3Service;
import com.castvot.admin.vo.article.ArticleParam;
import com.castvot.admin.vo.article.ArticleVO;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class ArticleServiceImpl{

    @Autowired
    ArticleMapper articleMapper;

    @Autowired
    AmazonS3Service amazonS3Service;

    @Value( "${bloackchain.api.url}" )
    String SERVER_URL;

    @Value( "${image.upload.path}" )
    String savePath;

    /**
     * 공지사항 목록 가져오기
     *
     * @param articleParam
     * @return
     */
    public List<ArticleVO> getBoard( ArticleParam articleParam ) {

        articleParam.setPageSize( 10 );

        int total = articleMapper.selectBoardCnt( articleParam );
        articleParam.setTotalCount( total );

        return articleMapper.selectBoardList( articleParam );
    }

    /**
     * 공지사항 상세정보
     *
     * @param articleParam
     * @return
     */
    public ArticleVO getBoardOne( ArticleParam articleParam ) {

        ArticleVO articleVO = articleMapper.selectBoard( articleParam );

        return articleVO;
    }

    /**
     * 공지사항 등록
     *
     * @param articleParam
     * @return
     */
    public CommonJsonVO registerBoard( ArticleParam articleParam ) throws  Exception {

        Timestamp timestamp = new Timestamp( System.currentTimeMillis() );

        articleParam.setWriter("캐스팅보트솔루션");
        articleParam.setRegDate( timestamp );
        articleParam.setMdfyDate( timestamp );

        int result = articleMapper.insertBoard( articleParam );

        if( result > 0 ) {
            return new CommonJsonVO();
        } else {
            return new CommonJsonVO( ResultType.INSERT_FAIL );
        }

    }

    /**
     * 공지사항 수정
     *
     * @param articleParam
     */
    public CommonJsonVO update( ArticleParam articleParam ) throws Exception {

        Timestamp timestamp = new Timestamp( System.currentTimeMillis() );

        articleParam.setMdfyDate( timestamp );

        int result = articleMapper.updateBoard( articleParam );

        if ( result > 0 ) {
            return new CommonJsonVO();
        } else {
            return new CommonJsonVO( ResultType.UPDATE_FAIL );
        }

    }

    /**
     * 공지사항 삭제
     *
     * @param articleParam
     */
    public CommonJsonVO removeBoard( ArticleParam articleParam ) {

        int result = articleMapper.deleteBoard( articleParam );

        if ( result > 0 ) {
            return new CommonJsonVO();
        } else {
            return new CommonJsonVO( ResultType.DELETE_FAIL );
        }

    }

}
