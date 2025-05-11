package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.model.Trip;
import com.trektrip.repository.ImageRepository;
import com.trektrip.repository.TripRepository;
import com.trektrip.utils.FilesUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private ImageRepository imageRepository;
    @Autowired
    private TripRepository tripRepository;
    @Autowired
    private FilesUtil filesUtil;

    @Value("${upload.path}")
    private String uploadPath; // Path to directory where images will be stored

//    public ImageServiceImpl(ImageRepository imageRepository, TripRepository tripRepository) {
//        this.imageRepository = imageRepository;
//        this.tripRepository = tripRepository;
//    }

    public void setUploadPath(String uploadPath) {
        this.uploadPath = uploadPath;
    }

    @Override
    public List<Image> getAllImages() {
        return imageRepository.findAll();
    }

    @Override
    public Optional<Image> getImageById(Long id) {
        return imageRepository.findById(id);
    }

    @Override
    public Image createImage(Image image) {
        return imageRepository.save(image);
    }

    @Override
    public Image updateImage(Image image, Long id) {
        Optional<Image> optionalImage = imageRepository.findById(id);

        if (optionalImage.isPresent()) {
            image.setId(id);
            return imageRepository.save(image);
        } else {
            throw new EntityNotFoundException("Image with ID = '" + id + "' not found!");
        }
    }

    @Override
    public void deleteImage(Long id) {
        imageRepository.deleteById(id);
    }

    @Override
    public Image handleImageUpload(MultipartFile file) throws IOException {
        String filename = UUID.randomUUID().toString(); // Generate a unique filename
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String filePath = uploadPath + File.separator + filename + fileExtension;
        Path destination = Paths.get(filePath);
        filesUtil.copy(file.getInputStream(), destination);

        String imageUrl = "/uploads/" + filename + fileExtension; // URL to access the image
        Image image = new Image();
        image.setUrl(imageUrl);

        return imageRepository.save(image);
    }


    @Override
    public void addImageToTrip(Long tripId, Long imageId) {
        // Dobavljanje putovanja iz baze podataka
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));

        // Dobavljanje slike iz baze podataka
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found with id: " + imageId));

        // Dodavanje slike na listu slika putovanja
        trip.getImages().add(image);

        // Spremanje ažuriranog putovanja u bazu podataka
        tripRepository.save(trip);
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return filename.substring(lastDotIndex);
        }
        return "";
    }
}
