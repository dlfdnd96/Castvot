package com.castvot.admin.mapper.candidate;

import com.castvot.admin.variable.code.CandidateCode;
import com.castvot.admin.vo.candidate.CandidateParam;
import com.castvot.admin.vo.candidate.CandidateVO;
import com.castvot.admin.vo.candidate.CoinAccountVO;
import com.castvot.admin.vo.candidate.CoinParam;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidateMapper {

    List < CandidateVO > selectCandidateList( CandidateParam candidateParam );

    int selectCnadidateCnt( CandidateParam candidateParam );

    CandidateVO selectCandidate( CandidateParam candidateParam );

    int updateStatus( CandidateParam candidateParam );

    int updateAccount( CandidateParam candidateParam );

    CoinAccountVO selectCoinAccount( CandidateParam candidateParam );

    void insertAccount( CoinParam coinParam );

    List < CoinAccountVO > selectCoinsAccount( CandidateParam candidateParam );

    int deleteBoy( CandidateParam candidateParam );

    int updateCandidate( CandidateParam candidateParam );
}
