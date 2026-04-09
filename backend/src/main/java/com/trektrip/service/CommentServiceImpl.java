package com.trektrip.service;

import com.trektrip.model.Comment;
import com.trektrip.repository.CommentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@Service
public class CommentServiceImpl implements CommentService {

    private CommentRepository commentRepository;

    @Override
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    @Override
    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    @Override
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(Comment comment, Long id) {
        Optional<Comment> optionalComment = commentRepository.findById(id);

        if (optionalComment.isPresent()) {
            comment.setId(id);
            return commentRepository.save(comment);
        } else {
            throw new EntityNotFoundException("Comment with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
