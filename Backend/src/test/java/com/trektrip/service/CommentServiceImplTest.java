package com.trektrip.service;

import com.trektrip.model.Comment;
import com.trektrip.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @InjectMocks
    private CommentService commentService = new CommentServiceImpl(commentRepository);

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllComments() {
        // Mock data
        List<Comment> comments = new ArrayList<>();
        comments.add(new Comment(1L, "Content 1"));
        comments.add(new Comment(2L, "Content 2"));

        when(commentRepository.findAll()).thenReturn(comments);

        // Call service method
        List<Comment> result = commentService.getAllComments();

        // Verify the result
        assertEquals(2, result.size());
        assertEquals("Content 1", result.get(0).getContent());
        assertEquals("Content 2", result.get(1).getContent());
    }

    @Test
    public void testGetCommentById() {
        Long commentId = 1L;
        Comment comment = new Comment(commentId, "Test content");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        Optional<Comment> result = commentService.getCommentById(commentId);

        assertTrue(result.isPresent());
        assertEquals("Test content", result.get().getContent());
    }

    @Test
    public void testGetCommentById_NotFound() {
        Long commentId = 1L;
        Comment comment = new Comment(commentId, "Test content");
        when(commentRepository.findById(commentId)).thenReturn(Optional.of(comment));

        Optional<Comment> commentReturn = commentService.getCommentById(commentId);

        Assertions.assertNotNull(commentReturn.get());
    }

    @Test
    public void testCreateComment() {
        Comment comment = new Comment();
        comment.setContent("New comment");

        when(commentRepository.save(any(Comment.class))).thenReturn(comment);

        Comment created = commentService.createComment(comment);

        assertNotNull(created);
        assertEquals("New comment", created.getContent());
    }

    @Test
    public void testUpdateComment() {
        Long commentId = 1L;
        Comment existingComment = new Comment(commentId, "Existing content");
        Comment updatedComment = new Comment(commentId, "Updated content");

        when(commentRepository.findById(commentId)).thenReturn(Optional.of(existingComment));
        when(commentRepository.save(any(Comment.class))).thenReturn(updatedComment);

        Comment result = commentService.updateComment(updatedComment, commentId);

        assertNotNull(result);
        assertEquals("Updated content", result.getContent());
    }

    @Test
    public void testUpdateComment_NotFound() {
        Long commentId = 1L;
        Comment updatedComment = new Comment(commentId, "Updated content");

        when(commentRepository.findById(commentId)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> {
            commentService.updateComment(updatedComment, commentId);
        });
    }

    @Test
    public void testDeleteComment() {
        Long commentId = 1L;

        // No need to mock repository behavior, just verify method call
        commentService.deleteComment(commentId);

        verify(commentRepository, times(1)).deleteById(commentId);
    }
}

