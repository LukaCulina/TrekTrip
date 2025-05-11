package com.trektrip.service;

import static org.junit.jupiter.api.Assertions.*;
import com.trektrip.model.UserRole;
import com.trektrip.repository.UserRepository;
import com.trektrip.repository.UserRoleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserRoleServiceImplTest {

    @Mock
    private UserRoleRepository userRoleRepository;

    @InjectMocks
    private UserRoleServiceImpl userRoleService;

    @Test
    public void testCreateUserRole() {
        UserRole userRole = new UserRole(1L, "USER");

        when(userRoleRepository.save(Mockito.any(UserRole.class))).thenReturn(userRole);

        UserRole savedUserRole = userRoleService.createUserRole(userRole);

        Assertions.assertNotNull(savedUserRole);

    }

    @Test
    public void testGetAllUserRoles() {
        UserRole userRole1 = new UserRole(1L, "USER");
        UserRole userRole2 = new UserRole(1L, "ADMIN");

        List<UserRole> allUserRoles = List.of(userRole1, userRole2);

        when(userRoleRepository.findAll()).thenReturn(allUserRoles);

        Assertions.assertNotNull(userRoleRepository.findAll());
    }

    @Test
    public void testUserRoleByIdExists() {
        Long id = 1L;
        UserRole userRole = new UserRole(1L, "USER");
        when(userRoleRepository.findById(id)).thenReturn(Optional.of(userRole));

        Optional<UserRole> userRoleReturn = userRoleService.getUserRoleById(id);

        Assertions.assertNotNull(userRoleReturn.get());
    }

    @Test
    public void testUserByIdDoesntExist() {
        Long id = 2L;
        when(userRoleRepository.findById(id)).thenReturn(Optional.empty());

        Optional<UserRole> userRoleReturn = userRoleService.getUserRoleById(id);

        Assertions.assertTrue(userRoleReturn.isEmpty());
    }

    @Test
    public void testUpdateUserRole() {
        Long id = 1L;
        UserRole userRole1 = new UserRole(1L, "USER");
        UserRole userRole2 = new UserRole(1L, "ADMIN");

        when(userRoleRepository.findById(id)).thenReturn(Optional.of(userRole1));
        when(userRoleRepository.save(userRole2)).thenReturn(userRole2);

        UserRole updateReturn = userRoleService.updateUserRole(userRole2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateUserRoleIfDoesntExist() {
        Long id = 3L;
        UserRole userRole2 = new UserRole(1L, "ADMIN");

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            UserRole updatedUser = userRoleService.updateUserRole(userRole2, id);
        });
    }

    @Test
    public void testDeleteUserRole() {
        Long id = 1L;
        userRoleService.deleteUserRole(id);
        verify(userRoleRepository).deleteById(id);
    }
}