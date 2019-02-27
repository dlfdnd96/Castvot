package com.castvot.admin.controller.home;

import java.util.Map;

import com.castvot.admin.vo.SearchVO;
import com.castvot.admin.vo.common.CommonJsonVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.castvot.admin.service.HomeServiceImpl;

@RestController
@RequestMapping(value = "/api/home")
public class HomeRestController {
	
	@Autowired HomeServiceImpl homserviceImpl;
	
	@RequestMapping(value = "/getContentList")
	private CommonJsonVO getContentList( SearchVO searchVO) throws Exception{
		CommonJsonVO result = new CommonJsonVO();
		Map<String, Object> map = homserviceImpl.selectContentList(searchVO);
		result.setData(map);
		return result;
	}
	
}
