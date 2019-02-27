package com.castvot.admin.service.wannabj;

import com.castvot.admin.common.FileType;
import com.castvot.admin.common.ResultType;
import com.castvot.admin.mapper.wannabj.WannabjMapper;
import com.castvot.admin.service.aws.AmazonS3Service;
import com.castvot.admin.util.ApiCall;
import com.castvot.admin.variable.code.WannabjCode.COIN_TYPE;
import com.castvot.admin.variable.code.WannabjCode.STATUS;
import com.castvot.admin.vo.common.CommonFileParam;
import com.castvot.admin.vo.common.CommonFileResultVO;
import com.castvot.admin.vo.common.CommonJsonVO;
import com.castvot.admin.vo.wannabj.WannabjCoinAccountVO;
import com.castvot.admin.vo.wannabj.WannabjCoinParam;
import com.castvot.admin.vo.wannabj.WannabjParam;
import com.castvot.admin.vo.wannabj.WannabjVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WannabjServiceImpl {

    @Autowired
    WannabjMapper mapper;

    @Autowired
    AmazonS3Service amazonS3Service;

    @Value( "${bloackchain.api.url}" )
    String SERVER_URL;

    @Value( "${image.upload.path}" )
    String savePath;

    /**
     * 후보자 목록 가져오기
     *
     * @param wannabjParam
     * @return
     */
    public List < WannabjVO > getWannabj( WannabjParam wannabjParam ) {

        wannabjParam.setPageSize( 10 );

        int total = mapper.selectWannabjCnt( wannabjParam );
        wannabjParam.setTotalCount( total );

        return mapper.selectWannabjList( wannabjParam );

    }

    /**
     * 후보자 상세정보
     *
     * @param wannabjParam
     * @return
     */
    public WannabjVO getWannabjOne( WannabjParam wannabjParam ) {

        WannabjVO wannabjVO = mapper.selectWannabj( wannabjParam);

        List < WannabjCoinAccountVO > coinList = mapper.selectWannabjCoinsAccount( wannabjParam );

        wannabjVO.setCoinList( coinList );

        return wannabjVO;

    }

    /**
     *
     * 승인 & 반려
     *
     * @param wannabjParam
     * @return
     */
    public CommonJsonVO updateWannabjStatus( WannabjParam wannabjParam ) throws IOException {

        CommonJsonVO result = new CommonJsonVO();

        WannabjVO vo = mapper.selectWannabj( wannabjParam);

        if ( vo != null ) {
            if ( wannabjParam.getStatus() == STATUS.ACTIVE ) {


                try {

                    wannabjParam.setCoinType( COIN_TYPE.ALT );
                    WannabjCoinAccountVO altVO = mapper.selectWannabjCoinAccount( wannabjParam );

                    if ( altVO == null ) {

                        ApiCall apiCall = new ApiCall( SERVER_URL + "/create_account_alt" );
                        Map < String, Object > altMap = apiCall.getData( "" );

                        WannabjCoinParam coinParam = new WannabjCoinParam();

                        if ( ( Integer ) altMap.get( "code" ) == 200 ) {

                            coinParam.setAccount( ( String ) altMap.get( "account" ) );
                            coinParam.setSecret( ( String ) altMap.get( "secret" ) );
                            coinParam.setBjPk( wannabjParam.getPk() );
                            coinParam.setCoinType( COIN_TYPE.ALT );

                            mapper.insertWannabjAccount( coinParam );

                        }


                    }

                    wannabjParam.setCoinType( COIN_TYPE.QTUM );
                    WannabjCoinAccountVO qtumVO = mapper.selectWannabjCoinAccount( wannabjParam );

                    // {"account":"rwzYNUH9dMgc3nJWcQQmx5PCVqRjhhomRS","secret":"ssSjpr1AnVqNuAUGXtP5GTX19efbu"}
                    if ( qtumVO == null ) {

                        ObjectMapper om = new ObjectMapper();

                        Map<String, Object> params = new HashMap<>();
                        params.put( "accountName", wannabjParam.getPk() );

                        String jsonString = om.writeValueAsString(params);

                        ApiCall apiCall = new ApiCall( SERVER_URL + "/create_account_qtum" );
                        Map < String, Object > qtumMap = apiCall.getData( jsonString );

                        WannabjCoinParam coinParam = new WannabjCoinParam();

                        if ( ( Integer ) qtumMap.get( "code" ) == 200 ) {

                            coinParam.setAccount( ( String ) qtumMap.get( "account" ) );
                            coinParam.setSecret( ( String ) qtumMap.get( "secret" ) );

                            coinParam.setBjPk( wannabjParam.getPk() );
                            coinParam.setCoinType( COIN_TYPE.QTUM );

                        }

                        mapper.insertWannabjAccount( coinParam );

                    }

                } catch ( Exception e ) {

                    result.setCode( ResultType.SERVER_ERROR );
                    result.setMsg( e.getMessage() );

                }

                mapper.updateWannabjStatus( wannabjParam );

            } else if ( wannabjParam.getStatus() == STATUS.REJECT ) {
                mapper.updateWannabjStatus( wannabjParam );
            } else {
                result.setCode( ResultType.UPDATE_FAIL );
            }
        } else {
            result.setCode( ResultType.UPDATE_FAIL );
        }

        return result;

    }

    public CommonJsonVO removeWannabj( WannabjParam wannabjParam ) {

        int result = mapper.deleteWannabj( wannabjParam );
        if ( result > 0 ) {
            return new CommonJsonVO(  );
        } else {
            return new CommonJsonVO( 60 );
        }

    }

    public CommonJsonVO updateWannabj( WannabjParam wannabjParam ) throws Exception {

        CommonFileParam param = new CommonFileParam();
        param.setSavePath( savePath );
        param.setThumbNail( true );
        param.setExcludeFileType( FileType.ETC );
        param.setVideoThumbNail( true );

        if ( wannabjParam.getBjPhoto1().getSize() > 0 ) {

            param.setFile( wannabjParam.getBjPhoto1() );
            CommonFileResultVO photo1 = amazonS3Service.putObject( param );
            wannabjParam.setBjPhotoName1( photo1.getFileName() );

        }

        if ( wannabjParam.getBjPhoto2().getSize() > 0 ) {

            param.setFile( wannabjParam.getBjPhoto2() );
            CommonFileResultVO photo2 = amazonS3Service.putObject( param );
            wannabjParam.setBjPhotoName2( photo2.getFileName() );

        }

        if ( wannabjParam.getBjPhoto3().getSize() > 0 ) {

            param.setFile( wannabjParam.getBjPhoto3() );
            CommonFileResultVO photo3 = amazonS3Service.putObject( param );
            wannabjParam.setBjPhotoName3( photo3.getFileName() );

        }

        if ( wannabjParam.getBjPhoto3().getSize() > 0 ) {

            param.setFile( wannabjParam.getBjPhoto3() );
            CommonFileResultVO photo3 = amazonS3Service.putObject( param );
            wannabjParam.setBjPhotoName3( photo3.getFileName() );

        }

        int result = mapper.updateWannabj( wannabjParam );

        if ( result > 0 ) {
            return new CommonJsonVO();
        } else {
            return new CommonJsonVO( ResultType.UPDATE_FAIL );
        }

    }
}
