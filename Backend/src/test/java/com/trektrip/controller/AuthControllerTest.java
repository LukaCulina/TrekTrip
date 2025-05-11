package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.dto.AuthRequestDTO;
import com.trektrip.dto.JwtResponseDTO;
import com.trektrip.dto.RefreshTokenRequestDTO;
import com.trektrip.model.RefreshToken;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.RefreshTokenRepository;
import com.trektrip.service.JwtService;
import com.trektrip.service.RefreshTokenService;
import com.trektrip.service.UserDetailsServiceImpl;
import jakarta.servlet.ServletException;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

@WebMvcTest(AuthController.class)
@ContextConfiguration
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RefreshTokenService refreshTokenService;
    @MockBean
    private RefreshTokenRepository refreshTokenRepository;
    @InjectMocks
    private AuthController authController;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    @MockBean
    private AuthenticationManager authenticationManager;
    @MockBean
    private Authentication authentication;

    @Autowired
    private ObjectMapper objectMapper;


    @Test
    @WithMockUser
    public void testLoginSuccessful() {
        String accessToken =  "AYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTY";
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c",
                Instant.now().plus(Duration.ofDays(30)), new UserInfo(1L, "user", "user1@mail.com",
                "password"));
        AuthRequestDTO authRequestDTO = new AuthRequestDTO("user", "password");

        when(authenticationManager.authenticate(Mockito.any(UsernamePasswordAuthenticationToken.class))).thenReturn(UsernamePasswordAuthenticationToken.authenticated(authRequestDTO.getUsername(), authRequestDTO.getPassword(), Collections.singleton(new SimpleGrantedAuthority("USER"))));
        when(refreshTokenService.createRefreshToken(authRequestDTO.getUsername())).thenReturn(refreshToken);
        when(jwtService.generateToken(authRequestDTO.getUsername())).thenReturn(accessToken);

        JwtResponseDTO jwtResponseDTO = authController.authenticateAndGetToken(authRequestDTO);

        assertEquals(jwtResponseDTO.getAccessToken(), accessToken);
        assertEquals(jwtResponseDTO.getToken(), refreshToken.getToken());
    }

    @Test
    @WithMockUser
    public void testRefreshTokenSuccessful() {
        String accessToken =  "AYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTYAYjcyMzY3ZDhiNmJkNTY";
        RefreshTokenRequestDTO refreshTokenRequestDTO = new RefreshTokenRequestDTO("RjY2NjM5NzA2OWJjuE7c");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c", Instant.now().plus(Duration.ofDays(30)), new UserInfo(1L, "user", "user1@mail.com", "password"));
        AuthRequestDTO authRequestDTO = new AuthRequestDTO("user", "password");

        when(refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())).thenReturn(Optional.of(refreshToken));
        when(refreshTokenService.verifyExpiration(refreshToken)).thenReturn(refreshToken);
        when(jwtService.generateToken(authRequestDTO.getUsername())).thenReturn(accessToken);

        JwtResponseDTO jwtResponseDTO = authController.refreshToken(refreshTokenRequestDTO);

        assertEquals(accessToken, jwtResponseDTO.getAccessToken());
        assertEquals(refreshToken.getToken(), jwtResponseDTO.getToken());
    }


    @Test
    @WithMockUser
    public void testLogoutSuccessful() throws Exception {
        RefreshTokenRequestDTO refreshTokenRequestDTO = new RefreshTokenRequestDTO("RjY2NjM5NzA2OWJjuE7c");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c", Instant.now().plus(Duration.ofDays(30)), new UserInfo(1L, "user1", "user1@mail.com", "pass1"));
        when(refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())).thenReturn(Optional.of(refreshToken));
        doNothing().when(refreshTokenRepository).delete(refreshToken);

        ResultActions response = mockMvc.perform(post("/auth/logout")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(refreshTokenRequestDTO)));

        response.andExpect(MockMvcResultMatchers.status().isOk());
    }

    @Test
    @WithMockUser
    public void testLogoutFailed() {
        RefreshTokenRequestDTO refreshTokenRequestDTO = new RefreshTokenRequestDTO("RjY2NjM5NzA2OWJjuE7c");
        when(refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())).thenReturn(Optional.empty());

        assertThrows(ServletException.class, () -> {
            ResultActions response = mockMvc.perform(post("/auth/logout")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(refreshTokenRequestDTO)));
        });
    }

}