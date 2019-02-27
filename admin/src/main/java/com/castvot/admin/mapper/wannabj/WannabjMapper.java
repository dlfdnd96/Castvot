package com.castvot.admin.mapper.wannabj;

import com.castvot.admin.vo.wannabj.WannabjCoinAccountVO;
import com.castvot.admin.vo.wannabj.WannabjCoinParam;
import com.castvot.admin.vo.wannabj.WannabjParam;
import com.castvot.admin.vo.wannabj.WannabjVO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WannabjMapper {

    List < WannabjVO > selectWannabjList( WannabjParam wannabjParam );

    int selectWannabjCnt( WannabjParam wannabjParam );

    WannabjVO selectWannabj( WannabjParam wannabjParam );

    int updateWannabjStatus( WannabjParam wannabjParam );

    int updateWannabjAccount( WannabjParam wannabjParam );

    WannabjCoinAccountVO selectWannabjCoinAccount( WannabjParam wannabjParam );

    void insertWannabjAccount( WannabjCoinParam wannabjCoinParam );

    List < WannabjCoinAccountVO > selectWannabjCoinsAccount( WannabjParam wannabjParam );

    int deleteWannabj( WannabjParam wannabjParam );

    int updateWannabj( WannabjParam wannabjParam );
}
