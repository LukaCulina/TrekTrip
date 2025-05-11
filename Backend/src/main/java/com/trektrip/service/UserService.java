package com.trektrip.service;

import com.trektrip.model.UserInfo;

import java.util.List;
import java.util.Optional;

public interface UserService {

    List<UserInfo> getAllUsers();
    Optional<UserInfo> getUserById(Long id);
    UserInfo createUser(UserInfo user);
    UserInfo updateUser(UserInfo user, Long id);
    void deleteUser(Long id);
}
