package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.UserInfo;
import com.trektrip.repository.ImageRepository;
import com.trektrip.service.ImageService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import com.trektrip.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = UserController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;
    @MockBean
    private ImageService imageService;
    @MockBean
    private ImageRepository imageRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private UserInfo user1;
    private UserInfo user2;

    @BeforeEach
    public void init() {
        user1 = new UserInfo(1L, "user1", "user1@mail.com", "pass1");
        user2 = new UserInfo(2L, "user2", "user2@mail.com", "pass2");
    }

    @Test
    public void testCreateUser() throws Exception {
        given(userService.createUser(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        ResultActions response = mockMvc.perform(post("/user/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        List<UserInfo> allUsers = List.of(user1, user2);
        when(userService.getAllUsers()).thenReturn(allUsers);

        ResultActions response = mockMvc.perform(get("/user/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allUsers.size())));

    }

    @Test
    @WithMockUser
    public void testGetUserByIdExists() throws Exception {
        Long id = 1L;
        when(userService.getUserById(id)).thenReturn(Optional.of(user1));

        ResultActions response = mockMvc.perform(get("/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user1.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user1.getEmail())));
    }

    @Test
    @WithMockUser
    public void testGetUserByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(userService.getUserById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/user/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }


    @Test
    @WithMockUser
    public void testUpdateUser() throws Exception {
        Long id = 1L;
        when(userService.updateUser(user2, id)).thenReturn(user2);

        ResultActions response = mockMvc.perform(put("/user/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.username", CoreMatchers.is(user2.getUsername())))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email", CoreMatchers.is(user2.getEmail())));
    }

    @Test
    @WithMockUser
    public void testUpdateUserNotFound() throws Exception {
        Long id = 3L;

        when(userService.updateUser(user2, id)).thenThrow(EntityNotFoundException.class);

        ResultActions response = mockMvc.perform(put("/user/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(user2)));

        response.andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser
    public void testDeleteUser() throws Exception {
        Long id = 1L;
        doNothing().when(userService).deleteUser(id);

        ResultActions response = mockMvc.perform(delete("/user/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}