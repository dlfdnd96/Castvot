package com.castvot.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.castvot.admin.mapper.HomeMapper;
import com.castvot.admin.util.PagingUtil;
import com.castvot.admin.vo.CodeVO;
import com.castvot.admin.vo.SearchVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service( value = "HomeService" )
public class HomeServiceImpl {

    @Autowired
    private HomeMapper homeMapper;

    public List < CodeVO > selectCodeList() {

        return homeMapper.codeList();
    }

    public void insertSave( boolean test ) throws Exception {

        homeMapper.insertSave();
        if ( test ) {
            throw new Exception();
        }

    }

    public Map < String, Object > selectContentList( SearchVO searchVO ) throws Exception {

        int cnt = homeMapper.selectContentListCnt( searchVO );
        Map < String, Object > map = new HashMap < String, Object >();

        if ( cnt <= 0 ) {
            map.put( "cnt", cnt );
            return map;
        } else {
            searchVO.setTotalCount( cnt );
            String html = PagingUtil.getPagingAjax( searchVO );

            map.put( "list", homeMapper.selectContentList( searchVO ) );
            map.put( "cnt", cnt );
            map.put( "pagingHtml", html );

            return map;
        }

    }
}
