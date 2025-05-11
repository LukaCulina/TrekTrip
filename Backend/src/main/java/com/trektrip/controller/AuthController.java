package com.trektrip.controller;

import com.trektrip.dto.RefreshTokenRequestDTO;
import com.trektrip.model.RefreshToken;
import com.trektrip.repository.RefreshTokenRepository;
import com.trektrip.service.JwtService;
import com.trektrip.dto.JwtResponseDTO;
import com.trektrip.dto.AuthRequestDTO;
import com.trektrip.service.RefreshTokenService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private AuthenticationManager authenticationManager;

    private JwtService jwtService;

    private RefreshTokenService refreshTokenService;

    private RefreshTokenRepository refreshTokenRepository;

    @PostMapping("/login")
    public JwtResponseDTO authenticateAndGetToken(@RequestBody AuthRequestDTO authRequestDTO){
        Logger logger = LoggerFactory.getLogger(getClass());
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequestDTO.getUsername(), authRequestDTO.getPassword()));
        if(authentication.isAuthenticated()){
            logger.info("User '{}' authenticated successfully", authRequestDTO.getUsername());
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequestDTO.getUsername());
            return JwtResponseDTO.builder()
                    .accessToken(jwtService.generateToken(authRequestDTO.getUsername()))
                    .token(refreshToken.getToken())
                    .build();
        } else {
            throw new UsernameNotFoundException("invalid user request..!!");
        }
    }

    @PostMapping("/refreshToken")
    public JwtResponseDTO refreshToken(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        System.out.println("Received refresh token request: " + refreshTokenRequestDTO.getToken());

        return refreshTokenService.findByToken(refreshTokenRequestDTO.getToken())
                .map(refreshToken -> {
                    System.out.println("Refresh token found in DB.");
                    refreshTokenService.verifyExpiration(refreshToken);
                    String username = refreshToken.getUserInfo().getUsername();
                    System.out.println("Generating new JWT for user: " + username);
                    String accessToken = jwtService.generateToken(username);
                    return JwtResponseDTO.builder()
                            .accessToken(accessToken)
                            .token(refreshTokenRequestDTO.getToken()).build();
                })
                .orElseThrow(() -> {
                    System.out.println("Refresh Token is not in DB or expired..!!");
                    return new RuntimeException("Refresh Token is not in DB or expired..!!");
                });
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenRequestDTO refreshTokenRequestDTO) {
        Optional<RefreshToken> refreshTokenOptional = refreshTokenService.findByToken(refreshTokenRequestDTO.getToken());
        if (refreshTokenOptional.isPresent()) {
            refreshTokenRepository.delete(refreshTokenOptional.get());
            System.out.println("Logout...");
            return ResponseEntity.ok().build();
        }

        throw new BadCredentialsException("Invalid token!");
    }

}
