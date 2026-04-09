package com.trektrip.controller;

import com.trektrip.model.Image;
import com.trektrip.service.ImageService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@RestController
@RequestMapping("/image")
public class ImageController {

    private ImageService imageService;

    @GetMapping("/all")
    public ResponseEntity<List<Image>> getAllImage() {
        return ResponseEntity.ok(imageService.getAllImages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Image> getImageById(@PathVariable Long id) {
        Optional<Image> optionalimage = imageService.getImageById(id);
        if (optionalimage.isPresent()) {
            return ResponseEntity.ok(optionalimage.get());
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping
    public ResponseEntity<Image> createImage(@RequestParam("file") MultipartFile file) {
        try {
            Image savedImage = imageService.handleImageUpload(file);
            return new ResponseEntity<>(savedImage, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Image> updateImage(@RequestBody Image image, @PathVariable Long id) {
        try {
            Image updatedImage = imageService.updateImage(image, id);
            return new ResponseEntity<>(updatedImage, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }
}
