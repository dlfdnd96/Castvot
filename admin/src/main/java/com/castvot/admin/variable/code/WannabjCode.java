package com.castvot.admin.variable.code;

public interface WannabjCode {

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

    enum COIN_TYPE implements CommonCode {

        ALT( "알트코인" ),
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
