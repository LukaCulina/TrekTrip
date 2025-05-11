package com.trektrip.service;

import com.trektrip.model.UserInfo;
import com.trektrip.model.UserRole;
import com.trektrip.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserInfo> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            UserInfo user = userOptional.get();

            List<UserRole> userRoleList = user.getRoles();

            String[] roles = new String[userRoleList.size()];

            for(int i = 0; i < userRoleList.size(); i++) {
                roles[i] = userRoleList.get(i).getName();
            }

            return User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .roles(roles)
                    .build();
        } else {
            throw new UsernameNotFoundException(username);
        }
    }

}
