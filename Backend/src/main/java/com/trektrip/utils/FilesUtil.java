package com.trektrip.utils;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class FilesUtil {
    public long copy(InputStream in, Path target, CopyOption... options) throws IOException {
        return Files.copy(in, target, options);
    }
}
