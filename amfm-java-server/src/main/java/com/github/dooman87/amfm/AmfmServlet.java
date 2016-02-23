package com.github.dooman87.amfm;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.Collection;
import java.util.Set;
import java.util.TreeSet;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 */
@WebServlet(urlPatterns = "/fs/*")
public class AmfmServlet extends HttpServlet {
    private final Logger log = Logger.getLogger(AmfmServlet.class.getName());

    private class CommandAndPath {
        public final String command;
        public final String path;

        public CommandAndPath(String command, String path) {
            this.command = command;
            this.path = path;
        }
    }

    private Path root;
    private Path bin;

    @Override
    public void init() throws ServletException {
        super.init();
        root = Paths.get(System.getProperty("user.home"), System.getProperty("amfm.files"), "Files");
        bin = Paths.get(System.getProperty("user.home"), System.getProperty("amfm.bin"));
        if (!Files.exists(bin)) {
            try {
                Files.createDirectory(bin);
            } catch (IOException e) {
                throw new ServletException(e);
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        CommandAndPath commandAndPath = command(req);
        Path newFilePath = path(commandAndPath.path);

        switch (commandAndPath.command) {
            case "touch":
                log.log(Level.INFO, "Upload file [" + newFilePath.getFileName().toString() + "] " +
                        "to [" + newFilePath.getParent().toString() + "]");
                Files.copy(req.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);
                break;
            case "mkdir":
                if (!Files.exists(newFilePath)) {
                    Files.createDirectory(newFilePath);
                } else {
                    resp.sendError(HttpServletResponse.SC_CONFLICT, "Dir [" + newFilePath.toString() + "] already exists");
                }
                break;
            case "rm":
                Path pathInBin = bin.resolve(root.relativize(newFilePath));
                Files.createDirectories(pathInBin.getParent());
                log.log(Level.INFO, "REMOVE [" + newFilePath + "] -> [" + pathInBin + "]");
                Files.move(newFilePath, pathInBin, StandardCopyOption.REPLACE_EXISTING);
                break;
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, UnsupportedEncodingException {
        CommandAndPath commandAndPath = command(req);
        try {
            switch (commandAndPath.command) {
                case "ls":
                    resp.setContentType("application/json");
                    resp.setCharacterEncoding("utf-8");
                    Collection<AmfmFile> files = ls(commandAndPath.path);
                    ObjectMapper objectMapper = new ObjectMapper();
                    objectMapper.writeValue(resp.getWriter(), files);
                    break;
            }
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error while getting list of files", e);
            throw new ServletException(e);
        }
    }

    private Collection<AmfmFile> ls(String path) throws IOException {
        final java.nio.file.Path pathToGet = path(path);
        final Set<AmfmFile> files = new TreeSet<>();

        Files.walkFileTree(pathToGet, new SimpleFileVisitor<Path>() {
            @Override
            public FileVisitResult preVisitDirectory(java.nio.file.Path dir, BasicFileAttributes attrs) throws IOException {
                if (pathToGet.equals(dir)) {
                    return FileVisitResult.CONTINUE;
                }

                files.add(new AmfmFile(dir, root));
                return FileVisitResult.SKIP_SUBTREE;
            }

            @Override
            public FileVisitResult visitFile(java.nio.file.Path file, BasicFileAttributes attrs) throws IOException {
                files.add(new AmfmFile(file, root));
                return FileVisitResult.CONTINUE;
            }
        });
        return files;
    }

    private CommandAndPath command(HttpServletRequest request) throws UnsupportedEncodingException {
        StringBuffer url = request.getRequestURL();
        String commandAndPath = url.substring(url.indexOf("/fs/") + "/fs/".length());
        int splitIdx = commandAndPath.indexOf('/');
        String path = "";
        if (splitIdx < 0) {
            splitIdx = commandAndPath.length();
        } else {
            path = commandAndPath.substring(splitIdx);
        }
        String command = commandAndPath.substring(0, splitIdx);
        return new CommandAndPath(command, URLDecoder.decode(path, "UTF-8"));
    }

    private Path path(String p) {
        return p.startsWith("/") ? root.resolve(p.substring(1)) : root.resolve(p);
    }
}
