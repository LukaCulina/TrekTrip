package com.trektrip.controller;

import com.trektrip.model.UserRole;
import com.trektrip.service.UserRoleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/userRole")
public class UserRoleController {

    private UserRoleService userRoleService;

    @GetMapping("/all")
    public ResponseEntity<List<UserRole>> getAllUserRole() {
        return ResponseEntity.ok(userRoleService.getAllUserRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserRole> getUserRoleById(@PathVariable Long id) {
        Optional<UserRole> optionaluserRole = userRoleService.getUserRoleById(id);
        if (optionaluserRole.isPresent()) {
            return ResponseEntity.ok(optionaluserRole.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<UserRole> createUserRole(@RequestBody UserRole userRole) {
        return new ResponseEntity<>(userRoleService.createUserRole(userRole), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserRole> updateUserRole(@RequestBody UserRole userRole, @PathVariable Long id) {
        try {
            UserRole updatedUserRole = userRoleService.updateUserRole(userRole, id);
            return new ResponseEntity<>(updatedUserRole, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserRole(@PathVariable Long id) {
        userRoleService.deleteUserRole(id);
        return ResponseEntity.noContent().build();
    }
}
