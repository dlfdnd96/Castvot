package com.castvot.admin.service.candidate;

import com.castvot.admin.common.FileType;
import com.castvot.admin.common.ResultType;
import com.castvot.admin.mapper.candidate.CandidateMapper;
import com.castvot.admin.service.aws.AmazonS3Service;
import com.castvot.admin.util.ApiCall;
import com.castvot.admin.variable.code.CandidateCode.COIN_TYPE;
import com.castvot.admin.variable.code.CandidateCode.STATUS;
import com.castvot.admin.vo.candidate.CandidateParam;
import com.castvot.admin.vo.candidate.CandidateVO;
import com.castvot.admin.vo.candidate.CoinAccountVO;
import com.castvot.admin.vo.candidate.CoinParam;
import com.castvot.admin.vo.common.CommonFileParam;
import com.castvot.admin.vo.common.CommonFileResultVO;
import com.castvot.admin.vo.common.CommonJsonVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.method.P;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CandidateServiceImpl {

    @Autowired
    CandidateMapper mapper;

    @Autowired
    AmazonS3Service amazonS3Service;

    @Value( "${bloackchain.api.url}" )
    String SERVER_URL;

    @Value( "${image.upload.path}" )
    String savePath;

    /**
     * 후보자 목록 가져오기
     *
     * @param candidateParam
     * @return
     */
    public List < CandidateVO > getCandidate( CandidateParam candidateParam ) {

        candidateParam.setPageSize( 10 );

        int total = mapper.selectCnadidateCnt( candidateParam );
        candidateParam.setTotalCount( total );

        return mapper.selectCandidateList( candidateParam );

    }

    /**
     * 후보자 상세정보
     *
     * @param candidateParam
     * @return
     */
    public CandidateVO getCandidateOne( CandidateParam candidateParam ) {

        CandidateVO candidateVO = mapper.selectCandidate( candidateParam );

        List < CoinAccountVO > coinList = mapper.selectCoinsAccount( candidateParam );

        candidateVO.setCoinList( coinList );

        return candidateVO;

    }

    /**
     *
     * 승인 & 반려
     *
     * @param candidateParam
     * @return
     */
    public CommonJsonVO updateStatus( CandidateParam candidateParam ) throws IOException {

        CommonJsonVO result = new CommonJsonVO();

        CandidateVO vo = mapper.selectCandidate( candidateParam );

        if ( vo != null ) {
            if ( candidateParam.getStatus() == STATUS.ACTIVE ) {


                try {

                    candidateParam.setCoinType( COIN_TYPE.XRP );
                    CoinAccountVO xrpVO = mapper.selectCoinAccount( candidateParam );

                    if ( xrpVO == null ) {

                        ApiCall apiCall = new ApiCall( SERVER_URL + "/create_account_xrp" );
                        Map < String, Object > xrpMap = apiCall.getData( "" );

                        CoinParam coinParam = new CoinParam();

                        if ( ( Integer ) xrpMap.get( "code" ) == 200 ) {

                            coinParam.setAccount( ( String ) xrpMap.get( "account" ) );
                            coinParam.setSecret( ( String ) xrpMap.get( "secret" ) );
                            coinParam.setBoyPk( candidateParam.getPk() );
                            coinParam.setCoinType( COIN_TYPE.XRP );

                            mapper.insertAccount( coinParam );

                        }


                    }

                    candidateParam.setCoinType( COIN_TYPE.QTUM );
                    CoinAccountVO qtumVO = mapper.selectCoinAccount( candidateParam );

                    // {"account":"rwzYNUH9dMgc3nJWcQQmx5PCVqRjhhomRS","secret":"ssSjpr1AnVqNuAUGXtP5GTX19efbu"}
                    if ( qtumVO == null ) {

                        ObjectMapper om = new ObjectMapper();

                        Map<String, Object> params = new HashMap<>();
                        params.put( "accountName", candidateParam.getPk() );

                        String jsonString = om.writeValueAsString(params);

                        ApiCall apiCall = new ApiCall( SERVER_URL + "/create_account_qtum" );
                        Map < String, Object > qtumMap = apiCall.getData( jsonString );

                        CoinParam coinParam = new CoinParam();

                        if ( ( Integer ) qtumMap.get( "code" ) == 200 ) {

                            coinParam.setAccount( ( String ) qtumMap.get( "account" ) );
                            coinParam.setSecret( ( String ) qtumMap.get( "secret" ) );

                            coinParam.setBoyPk( candidateParam.getPk() );
                            coinParam.setCoinType( COIN_TYPE.QTUM );

                        }

                        mapper.insertAccount( coinParam );

                    }

                } catch ( Exception e ) {

                    result.setCode( ResultType.SERVER_ERROR );
                    result.setMsg( e.getMessage() );

                }

                mapper.updateStatus( candidateParam );

            } else if ( candidateParam.getStatus() == STATUS.REJECT ) {
                mapper.updateStatus( candidateParam );
            } else {
                result.setCode( ResultType.UPDATE_FAIL );
            }
        } else {
            result.setCode( ResultType.UPDATE_FAIL );
        }

        return result;

    }

    public CommonJsonVO removeCandidate ( CandidateParam candidateParam ) {

        int result = mapper.deleteBoy( candidateParam );
        if ( result > 0 ) {
            return new CommonJsonVO(  );
        } else {
            return new CommonJsonVO( 60 );
        }

    }

    public CommonJsonVO update( CandidateParam candidateParam ) throws Exception {

        CommonFileParam param = new CommonFileParam();
        param.setSavePath( savePath );
        param.setThumbNail( true );
        param.setExcludeFileType( FileType.ETC );
        param.setVideoThumbNail( true );

        if ( candidateParam.getPhoto1().getSize() > 0 ) {

            param.setFile( candidateParam.getPhoto1() );
            CommonFileResultVO photo1 = amazonS3Service.putObject( param );
            candidateParam.setPhotoName1( photo1.getFileName() );

        }

        if ( candidateParam.getPhoto2().getSize() > 0 ) {

            param.setFile( candidateParam.getPhoto2() );
            CommonFileResultVO photo2 = amazonS3Service.putObject( param );
            candidateParam.setPhotoName2( photo2.getFileName() );

        }

        if ( candidateParam.getPhoto3().getSize() > 0 ) {

            param.setFile( candidateParam.getPhoto3() );
            CommonFileResultVO photo3 = amazonS3Service.putObject( param );
            candidateParam.setPhotoName3( photo3.getFileName() );

        }

        int result = mapper.updateCandidate( candidateParam );

        if ( result > 0 ) {
            return new CommonJsonVO();
        } else {
            return new CommonJsonVO( ResultType.UPDATE_FAIL );
        }

    }
}
