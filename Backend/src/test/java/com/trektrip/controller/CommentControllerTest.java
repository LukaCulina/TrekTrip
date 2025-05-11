package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.dto.CommentRequestDTO;
import com.trektrip.model.Comment;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.service.CommentService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@WebMvcTest(CommentController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
public class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @WithMockUser
    public void testGetAllComments() throws Exception {
        List<Comment> comments = new ArrayList<>();
        // populate comments list

        when(commentService.getAllComments()).thenReturn(comments);

        mockMvc.perform(MockMvcRequestBuilders.get("/comment/all"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$").isArray());
    }

    @Test
    @WithMockUser
    public void testGetCommentById() throws Exception {
        Long commentId = 1L;
        Comment comment = new Comment(commentId, "Content");
        // set comment properties

        when(commentService.getCommentById(commentId)).thenReturn(Optional.of(comment));

        mockMvc.perform(MockMvcRequestBuilders.get("/comment/{id}", commentId))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value(comment.getContent()));
    }

    @Test
    @WithMockUser
    public void testCreateComment() throws Exception {
        CommentRequestDTO requestDTO = new CommentRequestDTO();
        // set requestDTO properties

        Comment createdComment = new Comment();
        // set createdComment properties

        when(commentService.createComment(any(Comment.class))).thenReturn(createdComment);

        mockMvc.perform(MockMvcRequestBuilders.post("/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDTO)))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value(requestDTO.getContent()));
    }

    @Test
    @WithMockUser
    public void testUpdateComment() throws Exception {
        Long commentId = 1L;
        Comment updatedComment = new Comment();
        // set updatedComment properties

        when(commentService.updateComment(any(Comment.class), any(Long.class))).thenReturn(updatedComment);

        mockMvc.perform(MockMvcRequestBuilders.put("/comment/{id}", commentId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedComment)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.content").value(updatedComment.getContent()));
    }

    @Test
    @WithMockUser
    public void testDeleteComment() throws Exception {
        Long commentId = 1L;

        mockMvc.perform(MockMvcRequestBuilders.delete("/comment/{id}", commentId))
                .andExpect(MockMvcResultMatchers.status().isNoContent());
    }
}
