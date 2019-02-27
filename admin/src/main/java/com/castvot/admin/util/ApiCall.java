package com.castvot.admin.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

public class ApiCall {

    private String CALL_URL = "http://localhost:3003/create_account_xrp";
    private HttpURLConnection connection;

    public ApiCall() {}

    public ApiCall( String CALL_URL ) {

        this.CALL_URL = CALL_URL;
    }

    /**
     * apiCall
     *
     * @param params
     * @return
     * @throws IOException
     */
    public Map < String, Object > getData( String params ) throws IOException {

        URL url = new URL( CALL_URL );
        HttpURLConnection con = ( HttpURLConnection ) url.openConnection();
        con.setRequestMethod( "POST" );
        con.setRequestProperty( "Content-Type", "application/json" );
        con.setDoOutput( true );
        this.connection = con;
        DataOutputStream wr = new DataOutputStream( connection.getOutputStream() );
        wr.write( params.getBytes() );
        wr.flush();
        wr.close();

        int responseCode = connection.getResponseCode();
        BufferedReader br;
        if ( responseCode == 200 ) { // 정상 호출

            InputStream inputStream = connection.getInputStream();

            Map < String, Object > result = jsonStringToHashMapConverter( inputStream );

            inputStream.close();

            return result;

        } else {  // 에러 발생
            return null;
        }

    }

    /**
     * json object 변환
     *
     * @param inputStream
     * @return
     * @throws IOException
     */
    public Map < String, Object > jsonStringToHashMapConverter( InputStream inputStream ) throws IOException {

        Map < String, Object > map = new HashMap < String, Object >();
        ObjectMapper mapper = new ObjectMapper();
        map = mapper.readValue( inputStream, new TypeReference < Map < String, Object > >() {} );
        return map;

    }

}
