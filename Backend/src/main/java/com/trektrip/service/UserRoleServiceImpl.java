package com.trektrip.service;

import com.trektrip.model.UserRole;
import com.trektrip.repository.UserRoleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserRoleServiceImpl implements UserRoleService {

    private UserRoleRepository userRoleRepository;

    @Override
    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAll();
    }

    @Override
    public Optional<UserRole> getUserRoleById(Long id) {
        return userRoleRepository.findById(id);
    }

    @Override
    public UserRole createUserRole(UserRole userRole) {
        return userRoleRepository.save(userRole);
    }

    @Override
    public UserRole updateUserRole(UserRole userRole, Long id) {
        Optional<UserRole> optionalUserRole = userRoleRepository.findById(id);

        if (optionalUserRole.isPresent()) {
            userRole.setId(id);
            return userRoleRepository.save(userRole);
        } else {
            throw new EntityNotFoundException("UserRole with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteUserRole(Long id) {
        userRoleRepository.deleteById(id);
    }
}
