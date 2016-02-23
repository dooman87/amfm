package com.github.dooman87.amfm;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.webapp.WebAppContext;

import java.io.File;

public class Main {
    public static void main(String[] args) throws Exception {
        Server server = new Server(8181);

        // The WebAppContext is the entity that controls the environment in
        // which a web application lives and breathes. In this example the
        // context path is being set to "/" so it is suitable for serving root
        // context requests and then we see it setting the location of the war.
        // A whole host of other configurations are available, ranging from
        // configuring to support annotation scanning in the webapp (through
        // PlusConfiguration) to choosing where the webapp will unpack itself.
        WebAppContext webapp = new WebAppContext();
        webapp.setContextPath("/");
        webapp.addServlet(AmfmServlet.class, "/fs/*");
        File warFile = new File(".");
        webapp.setWar(warFile.getAbsolutePath());

        // A WebAppContext is a ContextHandler as well so it needs to be set to
        // the server so it is aware of where to send the appropriate requests.
        server.setHandler(webapp);

        server.start();
        server.dumpStdErr();
        server.join();
    }
}