package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.model.UserInfo;
import com.trektrip.model.UserRole;
import com.trektrip.repository.ImageRepository;
import com.trektrip.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private ImageRepository imageRepository;

    @Override
    public List<UserInfo> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<UserInfo> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public UserInfo createUser(UserInfo user) {
        if (user.getRoles() == null) {
            user.setRoles(new ArrayList<>());
            user.getRoles().add(new UserRole(1L));
        }
        return userRepository.save(user);
    }

    public UserInfo updateUser(UserInfo updatedUserInfo, Long id) {
        Optional<UserInfo> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            UserInfo existingUser = optionalUser.get();

            if (updatedUserInfo.getUsername() != null) {
                existingUser.setUsername(updatedUserInfo.getUsername());
            }
            if (updatedUserInfo.getDescription() != null) {
                existingUser.setDescription(updatedUserInfo.getDescription());
            }
            if (updatedUserInfo.getImage() != null) {
                Image image = imageRepository.findById(updatedUserInfo.getImage().getId())
                        .orElseThrow(() -> new RuntimeException("Image not found"));
                existingUser.setImage(image);
            }

            return userRepository.save(existingUser);
        } else {
            throw new EntityNotFoundException("UserInfo with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
