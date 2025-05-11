package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.model.UserRole;
import com.trektrip.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import javax.swing.plaf.SpinnerUI;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Test
    public void testLoadByUsername() {
        String username = "user";
        Image image = new Image(1L, "url1");
        Trip trip = new Trip(1L, "Naslov 1", "Opis 1", 3, true);
        UserInfo user = new UserInfo(1L, "user", "user@mail.com", "password", image,
                "desc 1", List.of(new UserRole(1L, "USER")), List.of(trip));

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        assertNotNull(userDetails);
    }

    @Test
    public void testLoadByUsernameNotFound() {
        String username = "user2";

        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class, () -> {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        });
    }
}
