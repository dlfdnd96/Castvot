package com.castvot.admin.variable.code;

public interface CandidateCode {

    enum STATUS implements CommonCode {

        DRAFT( "승인 대기" ),
        ACTIVE( "승인 완료" ),
        REJECT( "반려" );

        String codeName;

        STATUS( String codeName ) {

            this.codeName = codeName;

        }

        public String getCodeName() {

            return codeName;

        }
    }

    enum BLOOD_TYPE implements CommonCode {

        A( "A형" ),
        B( "B형" ),
        AB( "AB형" ),
        O( "O형" );

        String bloodType;

        BLOOD_TYPE( String bloodType ) {

            this.bloodType = bloodType;

        }

        public String getBloodType() {

            return bloodType;

        }

    }

    enum COIN_TYPE implements CommonCode {

        XRP( "리플" ),
        QTUM( "퀀텀" );

        String title;

        COIN_TYPE( String title ) {

            this.title = title;
        }

        public String getTitle() {

            return title;
        }
    }

}
