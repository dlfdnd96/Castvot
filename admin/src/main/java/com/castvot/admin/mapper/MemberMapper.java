package com.castvot.admin.mapper;

import com.castvot.admin.vo.member.UserVO;
import com.castvot.admin.vo.param.LoginParam;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberMapper {

    UserVO selectMember ( LoginParam loginParam );

}
