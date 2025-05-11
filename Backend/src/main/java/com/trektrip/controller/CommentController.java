package com.trektrip.controller;

import com.trektrip.dto.CommentRequestDTO;
import com.trektrip.model.Comment;
import com.trektrip.model.Trip;
import com.trektrip.model.UserInfo;
import com.trektrip.service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comment")
@AllArgsConstructor
public class CommentController {

    private CommentService commentService;

    @GetMapping("/all")
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(commentService.getAllComments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Comment> getCommentById(@PathVariable Long id) {
        Optional<Comment> optionalComment = commentService.getCommentById(id);
        if (optionalComment.isPresent()) {
            return ResponseEntity.ok(optionalComment.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody CommentRequestDTO commentRequest) {
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());

        Trip trip = new Trip();
        trip.setId(commentRequest.getTripId());
        comment.setTrip(trip);

        UserInfo user = new UserInfo();
        user.setId(commentRequest.getUserId());
        comment.setUser(user);

        Comment createdComment = commentService.createComment(comment);
        return new ResponseEntity<>(createdComment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(@RequestBody Comment comment, @PathVariable Long id) {
        try {
            Comment updatedComment = commentService.updateComment(comment, id);
            return new ResponseEntity<>(updatedComment, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }

}
