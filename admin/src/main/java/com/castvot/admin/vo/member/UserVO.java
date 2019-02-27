package com.castvot.admin.vo.member;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties( { "userPw" } )
public class UserVO implements UserDetails {

    private static final long serialVersionUID = -4450269958885980297L;

    private long   pk;
    private String id;
    private String name;
    private String cdate;
    private String authority;                            // 유저 권한

    @JsonIgnore
    private String password;                                // 유저 비밀번호

    @JsonIgnore
    private List < GrantedAuthority > role;                // 유저인증정보

    public long getPk() {

        return pk;
    }

    public void setPk( long pk ) {

        this.pk = pk;
    }

    public String getId() {

        return id;
    }

    public void setId( String id ) {

        this.id = id;
    }

    public String getName() {

        return name;
    }

    public void setName( String name ) {

        this.name = name;
    }

    public String getCdate() {

        return cdate;
    }

    public void setCdate( String cdate ) {

        this.cdate = cdate;
    }

    public void setPassword( String password ) {

        this.password = password;
    }

    public String getAuthority() {

        return authority;
    }

    public void setAuthority( String authority ) {

        List < GrantedAuthority > roles = new ArrayList < GrantedAuthority >();
        roles.add( new SimpleGrantedAuthority( authority ) );
        this.role = roles;
        this.authority = authority;
    }

    public List < GrantedAuthority > getRole() {

        return role;
    }

    public void setRole( List < GrantedAuthority > role ) {

        this.role = role;
    }

    @Override
    public Collection < ? extends GrantedAuthority > getAuthorities() {

        return role;
    }

    @Override
    public String getPassword() {

        return password;
    }

    @Override
    public String getUsername() {

        return id;
    }

    @Override
    public boolean isAccountNonExpired() {

        return false;
    }

    @Override
    public boolean isAccountNonLocked() {

        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {

        return false;
    }

    @Override
    public boolean isEnabled() {

        return false;
    }

}
