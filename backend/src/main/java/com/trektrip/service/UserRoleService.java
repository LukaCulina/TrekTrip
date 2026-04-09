package com.trektrip.service;

import com.trektrip.model.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserRoleService {
    List<UserRole> getAllUserRoles();
    Optional<UserRole> getUserRoleById(Long id);
    UserRole createUserRole(UserRole userRole);
    UserRole updateUserRole(UserRole userRole, Long id);
    void deleteUserRole(Long id);
}
