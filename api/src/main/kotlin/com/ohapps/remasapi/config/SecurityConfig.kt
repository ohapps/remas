package com.ohapps.remasapi.config

import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter

@Configuration
class SecurityConfig() : WebSecurityConfigurerAdapter() {
    override fun configure(http: HttpSecurity) {
        http.cors()
            .and()
            .httpBasic().disable()
            .authorizeRequests()
            .mvcMatchers("/actuator/**").permitAll()
            .mvcMatchers("/swagger-ui.html").permitAll()
            .mvcMatchers("/swagger-ui/**").permitAll()
            .mvcMatchers("/v3/**").permitAll()
            .anyRequest().authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt()
    }
}
