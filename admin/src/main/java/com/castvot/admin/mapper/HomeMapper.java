package com.castvot.admin.mapper;

import java.util.List;

import com.castvot.admin.vo.CodeVO;
import com.castvot.admin.vo.ContentVO;
import com.castvot.admin.vo.SearchVO;
import org.springframework.stereotype.Repository;

@Repository
public interface HomeMapper {
	public List<CodeVO > codeList ();

	public void insertSave();

	public int selectContentListCnt(SearchVO searchVO);

	public List<ContentVO > selectContentList( SearchVO searchVO);
	
}
