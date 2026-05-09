package br.com.moedaestudantil.exception;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import java.util.Map;

@Produces
@Singleton
public class NotFoundExceptionHandler implements ExceptionHandler<NotFoundException, HttpResponse<Map<String, String>>> {

    @Override
    public HttpResponse<Map<String, String>> handle(io.micronaut.http.HttpRequest request, NotFoundException exception) {
        return HttpResponse.notFound(Map.of("error", exception.getMessage()));
    }
}


