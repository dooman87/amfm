package com.github.dooman87.amfm;

import java.io.Serializable;
import java.nio.file.Files;
import java.nio.file.Path;

/**
 * File representation for AmFm
 */
public class AmfmFile implements Serializable, Comparable<AmfmFile> {
    private Path path;
    private Path fullPath;

    public AmfmFile(Path path, Path rootPath) {
        this.path = path;
        this.fullPath = rootPath.relativize(path);
    }

    public String getName() {
        return path.getFileName().toString();
    }

    public boolean isDirectory() {
        return Files.isDirectory(path);
    }

    public String getFullPath() {
        return "/" + fullPath.toString().replace('\\', '/');
    }

    @Override
    public int compareTo(AmfmFile o) {
        return getName().compareTo(o.getName());
    }
}
