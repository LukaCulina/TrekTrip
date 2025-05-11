package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.UserRole;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import com.trektrip.service.UserRoleService;
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

@WebMvcTest(controllers = UserRoleController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class UserRoleRoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRoleService userRoleService;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userRoleDetailsService;


    @Autowired
    private ObjectMapper objectMapper;

    private UserRole role1;
    private UserRole role2;

    @BeforeEach
    public void init() {
        role1 = new UserRole(1L, "USER");
        role2 = new UserRole(2L, "ADMIN");
    }

    @Test
    public void testCreateUserRole() throws Exception{
        given(userRoleService.createUserRole(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        ResultActions response = mockMvc.perform(post("/userRole")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(role1)));

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", CoreMatchers.is(role1.getName())));
    }

    @Test
    public void testGetAllUserRoles() throws Exception {
        List<UserRole> allUserRoles = List.of(role1, role2);
        when(userRoleService.getAllUserRoles()).thenReturn(allUserRoles);

        ResultActions response = mockMvc.perform(get("/userRole/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allUserRoles.size())));

    }

    @Test
    @WithMockUser
    public void testGetUserRoleByIdIfExists() throws Exception {
        Long id = 1L;
        when(userRoleService.getUserRoleById(id)).thenReturn(Optional.of(role1));

        ResultActions response = mockMvc.perform(get("/userRole/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(role1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", CoreMatchers.is(role1.getName())));
    }

    @Test
    @WithMockUser
    public void testGetUserRoleByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(userRoleService.getUserRoleById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/userRole/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateUserRole() throws Exception {
        Long id = 1L;
        when(userRoleService.updateUserRole(role2, id)).thenReturn(role2);

        ResultActions response = mockMvc.perform(put("/userRole/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(role2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", CoreMatchers.is(role2.getName())));
    }

    @Test
    @WithMockUser
    public void testDeleteUserRole() throws Exception {
        Long id = 1L;
        doNothing().when(userRoleService).deleteUserRole(id);

        ResultActions response = mockMvc.perform(delete("/userRole/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}