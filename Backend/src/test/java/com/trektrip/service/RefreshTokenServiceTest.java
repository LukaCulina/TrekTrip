package com.trektrip.service;

import com.trektrip.model.RefreshToken;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.RefreshTokenRepository;
import com.trektrip.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.test.context.support.WithMockUser;

import java.sql.Ref;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    @Test
    public void testCreateRefreshToken() {
        String username = "user";
        UserInfo user = new UserInfo(1L, "user", "user@mail.com", "password");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c",
                Instant.now().plus(Duration.ofDays(30)), user);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(refreshTokenRepository.save(Mockito.any(RefreshToken.class))).thenReturn(refreshToken);

        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(username);

        assertEquals(refreshToken, newRefreshToken);
    }

    @Test
    public void testFindByToken() {
        String token = "RjY2NjM5NzA2OWJjuE7c";
        UserInfo user = new UserInfo(1L, "user", "user@mail.com", "password");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c",
                Instant.now().plus(Duration.ofDays(30)), user);

        when(refreshTokenRepository.findByToken(Mockito.any(String.class))).thenReturn(Optional.of(refreshToken));

        Optional<RefreshToken> newRefreshToken = refreshTokenService.findByToken(token);

        assertNotNull(newRefreshToken.get());
    }

    @Test
    public void testVerifyExpirationValid() {
        UserInfo user = new UserInfo(1L, "user", "user@mail.com", "password");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c",
                Instant.now().plus(Duration.ofDays(30)), user);

        RefreshToken newRefreshToken = refreshTokenService.verifyExpiration(refreshToken);

        assertEquals(refreshToken, newRefreshToken);
    }

    @Test
    public void testVerifyExpirationInvalid() {
        UserInfo user = new UserInfo(1L, "user", "user@mail.com", "password");
        RefreshToken refreshToken = new RefreshToken(1L, "RjY2NjM5NzA2OWJjuE7c",
                Instant.now().minus(Duration.ofDays(30)), user);

        assertThrows(RuntimeException.class, () -> {
            RefreshToken newRefreshToken = refreshTokenService.verifyExpiration(refreshToken);
        });
    }
}