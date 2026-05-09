package br.com.moedaestudantil.exception;

import io.micronaut.http.HttpResponse;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import jakarta.inject.Singleton;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.HashMap;
import java.util.Map;

@Produces
@Singleton
public class ConstraintViolationExceptionHandler implements ExceptionHandler<ConstraintViolationException, HttpResponse<Map<String, Object>>> {

    @Override
    public HttpResponse<Map<String, Object>> handle(io.micronaut.http.HttpRequest request, ConstraintViolationException exception) {
        Map<String, String> fields = new HashMap<>();
        for (ConstraintViolation<?> violation : exception.getConstraintViolations()) {
            String path = violation.getPropertyPath() == null ? "request" : violation.getPropertyPath().toString();
            fields.put(path, violation.getMessage());
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("error", "Dados invalidos");
        payload.put("fields", fields);
        return HttpResponse.badRequest(payload);
    }
}


