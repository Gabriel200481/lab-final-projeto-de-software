package br.com.moedaestudantil.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import io.micronaut.context.annotation.Value;
import io.micronaut.http.HttpHeaders;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Get;
import io.micronaut.http.annotation.PathVariable;
import io.micronaut.http.annotation.Controller;
import io.micronaut.security.annotation.Secured;
import io.micronaut.security.rules.SecurityRule;

@Secured(SecurityRule.IS_ANONYMOUS)
@Controller("/api/qrcodes")
public class QrCodeController {

    @Value("${app.qrcode.basepath:qrcodes/}")
    private String qrcodePath;

    @Get("/{fileName:.+}")
    public HttpResponse<byte[]> getQrCode(@PathVariable String fileName) {
        try {
            Path baseDir = Paths.get(qrcodePath).toAbsolutePath().normalize();
            Path file = baseDir.resolve(fileName).normalize();
            if (!file.startsWith(baseDir)) {
                return HttpResponse.notFound();
            }
            if (!Files.exists(file) || !Files.isReadable(file)) {
                return HttpResponse.notFound();
            }

            byte[] content = Files.readAllBytes(file);
            return HttpResponse.ok(content)
                    .contentType(MediaType.IMAGE_PNG_TYPE)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName() + "\"");
        } catch (Exception ex) {
            return HttpResponse.notFound();
        }
    }
}



