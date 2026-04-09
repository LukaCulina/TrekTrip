package com.trektrip.service;

import com.trektrip.model.Comment;

import java.util.List;
import java.util.Optional;

public interface CommentService {

    List<Comment> getAllComments();

    Optional<Comment> getCommentById(Long id);

    Comment createComment(Comment comment);

    Comment updateComment(Comment comment, Long id);

    void deleteComment(Long id);
}
