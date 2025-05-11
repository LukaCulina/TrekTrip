package com.trektrip.service;

import com.trektrip.model.Image;
import com.trektrip.model.Trip;
import com.trektrip.repository.ImageRepository;
import com.trektrip.repository.TripRepository;
import com.trektrip.utils.FilesUtil;
import jakarta.persistence.Access;
import jakarta.persistence.EntityNotFoundException;
import jdk.jshell.execution.FailOverExecutionControlProvider;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith({MockitoExtension.class, SpringExtension.class})
class ImageServiceImplTest {
    @Mock
    private ImageRepository imageRepository;
    @Mock
    private TripRepository tripRepository;
    @Mock
    private FilesUtil filesUtil;


    @InjectMocks
    private ImageServiceImpl imageService;

    @Test
    public void testCreateImage() {
        Image image = new Image(1L, "url1");

        when(imageRepository.save(Mockito.any(Image.class))).thenReturn(image);

        Image savedImage = imageService.createImage(image);

        Assertions.assertNotNull(savedImage);

    }

    @Test
    public void testHandleImageUpload() throws IOException {
        Image image = new Image(1L, "url1");
        MockMultipartFile mockMultipartFile = new MockMultipartFile("file", "test.jpg", "image/jpeg", new ClassPathResource("test.jpg").getInputStream());

        when(imageRepository.save(Mockito.any(Image.class))).thenReturn(image);
        when(filesUtil.copy(Mockito.any(InputStream.class), Mockito.any(Path.class))).thenReturn(10L);

        imageService.setUploadPath("../images");
        Image newImage = imageService.handleImageUpload(mockMultipartFile);

        Assertions.assertNotNull(newImage);
    }

    @Test
    public void testAddImageToTripSuccessful() {
        Trip trip1 = new Trip(1L, "Naslov 1", "Opis 1", 3, true, new ArrayList<>());
        Image image = new Image(1L, "url1");

        when(tripRepository.findById(1L)).thenReturn(Optional.of(trip1));
        when(imageRepository.findById(1L)).thenReturn(Optional.of(image));
        when(tripRepository.save(Mockito.any(Trip.class))).thenReturn(trip1);

        imageService.addImageToTrip(1L, 1L);

        verify(tripRepository).save(trip1);
    }

    @Test
    public void testAddImageToTripFailed() {

        when(tripRepository.findById(3L)).thenReturn(Optional.empty());
        when(imageRepository.findById(3L)).thenReturn(Optional.empty());

        Assertions.assertThrows(RuntimeException.class, () -> {
            imageService.addImageToTrip(1L, 1L);
        });
    }

    @Test
    public void testGetAllImages() {
        Image image1 = new Image(1L, "url1");
        Image image2 = new Image(2L, "url2");

        List<Image> allImages = List.of(image1, image2);

        when(imageRepository.findAll()).thenReturn(allImages);

        Assertions.assertNotNull(imageRepository.findAll());
    }

    @Test
    public void testImageByIdExists() {
        Long id = 1L;
        Image image = new Image(1L, "url1");
        when(imageRepository.findById(id)).thenReturn(Optional.of(image));

        Optional<Image> imageReturn = imageService.getImageById(id);

        Assertions.assertNotNull(imageReturn.get());
    }

    @Test
    public void testImageByIdDoesntExist() {
        Long id = 2L;
        when(imageRepository.findById(id)).thenReturn(Optional.empty());

        Optional<Image> imageReturn = imageService.getImageById(id);

        Assertions.assertTrue(imageReturn.isEmpty());
    }

    @Test
    public void testUpdateImage() {
        Long id = 1L;
        Image image1 = new Image(1L, "url1");
        Image image2 = new Image(2L, "url2");

        when(imageRepository.findById(id)).thenReturn(Optional.of(image1));
        when(imageRepository.save(image2)).thenReturn(image2);

        Image updateReturn = imageService.updateImage(image2, id);

        Assertions.assertNotNull(updateReturn);
    }

    @Test
    public void testUpdateImageIfDoesntExist() {
        Long id = 3L;
        Image image2 = new Image(2L, "url2");

        Assertions.assertThrows(EntityNotFoundException.class, () -> {
            Image updatedImage = imageService.updateImage(image2, id);
        });
    }

    @Test
    public void testDeleteImage() {
        Long id = 1L;

        imageService.deleteImage(id);
        verify(imageRepository).deleteById(id);
    }
}