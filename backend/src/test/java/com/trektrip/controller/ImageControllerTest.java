package com.trektrip.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trektrip.model.Image;
import com.trektrip.service.ImageService;
import com.trektrip.service.JwtService;
import com.trektrip.service.UserDetailsServiceImpl;
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
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.List;
import java.util.Optional;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@WebMvcTest(controllers = ImageController.class)
@AutoConfigureMockMvc(addFilters = false)
@ExtendWith(MockitoExtension.class)
class ImageControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageService imageService;

    @MockBean
    private JwtService jwtService;
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private Image image1;
    private Image image2;

    @BeforeEach
    public void init() {
        image1 = new Image(1L, "url1");
        image2 = new Image(2L, "url2");
    }

    @Test
    @WithMockUser
    public void testCreateImage() throws Exception{
        given(imageService.createImage(ArgumentMatchers.any())).willAnswer((invocationOnMock -> invocationOnMock.getArgument(0)));

        MockMultipartFile mockMultipartFile = new MockMultipartFile("file", "test.jpg", null, new ClassPathResource("test.jpg").getInputStream());

        when(imageService.handleImageUpload(mockMultipartFile)).thenReturn(image1);

        ResultActions response = mockMvc.perform(multipart("/image")
                        .file(mockMultipartFile)
                );

        response.andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.url", CoreMatchers.is(image1.getUrl())));

    }

    @Test
    @WithMockUser
    public void testGetAllImages() throws Exception {
        List<Image> allImages = List.of(image1, image2);
        when(imageService.getAllImages()).thenReturn(allImages);

        ResultActions response = mockMvc.perform(get("/image/all")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.size()", CoreMatchers.is(allImages.size())));

    }

    @Test
    @WithMockUser
    public void testGetImageByIdIfExists() throws Exception {
        Long id = 1L;
        when(imageService.getImageById(id)).thenReturn(Optional.of(image1));

        ResultActions response = mockMvc.perform(get("/image/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(image1)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.url", CoreMatchers.is(image1.getUrl())));
    }

    @Test
    @WithMockUser
    public void testGetImageByIdDoesntExist() throws Exception {
        Long id = 3L;
        when(imageService.getImageById(id)).thenReturn(Optional.empty());

        ResultActions response = mockMvc.perform(get("/image/3")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

    @Test
    @WithMockUser
    public void testUpdateImage() throws Exception {
        Long id = 1L;
        when(imageService.updateImage(image2, id)).thenReturn(image2);

        ResultActions response = mockMvc.perform(put("/image/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(image2)));

        response.andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.url", CoreMatchers.is(image2.getUrl())));
    }

    @Test
    @WithMockUser
    public void testUpdateImageFailed() throws Exception {
        Long id = 3L;

        when(imageService.updateImage(image2, id)).thenThrow(EntityNotFoundException.class);

        ResultActions response = mockMvc.perform(put("/image/3")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(image2)));

        response.andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    @WithMockUser
    public void testDeleteImage() throws Exception {
        Long id = 1L;
        doNothing().when(imageService).deleteImage(id);

        ResultActions response = mockMvc.perform(delete("/image/1")
                .contentType(MediaType.APPLICATION_JSON));

        response.andExpect(MockMvcResultMatchers.status().isNoContent());
    }

}
