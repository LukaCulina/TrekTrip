package com.trektrip.controller;

import com.trektrip.model.Image;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.ImageRepository;
import com.trektrip.service.ImageService;
import com.trektrip.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {

    private UserService userService;
    private PasswordEncoder passwordEncoder;
    private final ImageService imageService; // Inject ImageService
    private ImageRepository imageRepository;


    @GetMapping("/all")
    public ResponseEntity<List<UserInfo>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserInfo> getUserById(@PathVariable Long id) {
        Optional<UserInfo> optionalUser = userService.getUserById(id);
        if (optionalUser.isPresent()) {
            return ResponseEntity.ok(optionalUser.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<UserInfo> createUser(@RequestBody UserInfo user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserInfo> updateUser(@PathVariable Long id, @RequestBody UserInfo userinfo) {
        try {
            UserInfo updatedUser = userService.updateUser(userinfo, id);
            return new ResponseEntity<>(updatedUser, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
