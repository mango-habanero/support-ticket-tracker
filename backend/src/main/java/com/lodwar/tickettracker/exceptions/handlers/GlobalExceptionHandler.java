package com.lodwar.tickettracker.exceptions.handlers;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.lodwar.tickettracker.dtos.responses.api.ErrorResponse;
import com.lodwar.tickettracker.dtos.responses.api.ErrorResponse.ErrorDetail;
import com.lodwar.tickettracker.enums.ResponseCode;
import com.lodwar.tickettracker.exceptions.BaseException;
import com.lodwar.tickettracker.utilities.responses.ErrorResponseBuilder;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private static final String INVALID_FORMAT_MESSAGE = "Field format is invalid.";
  private static final Set<String> MISSING_VALUE_CONSTRAINTS = Set.of("NotBlank", "NotNull");
  private static final String TYPE_MISMATCH_CODE = "typeMismatch";

  @ExceptionHandler(BaseException.class)
  public ResponseEntity<Object> handleBaseException(BaseException ex, WebRequest request) {
    return respond(
        ex,
        ErrorResponseBuilder.buildErrorResponse(
            ex.getMessage(), pathOf(request), ex.getResponseCode()));
  }

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex,
      Object body,
      HttpHeaders headers,
      HttpStatusCode statusCode,
      WebRequest request) {
    return respond(ex, toResponseCode(statusCode), request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleGenericException(Exception ex, WebRequest request) {
    return respond(ex, ResponseCode.INTERNAL_SERVER_ERROR, request);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    List<FieldError> fieldErrors = ex.getBindingResult().getFieldErrors();
    boolean missing =
        !fieldErrors.isEmpty()
            && fieldErrors.stream()
                .allMatch(error -> MISSING_VALUE_CONSTRAINTS.contains(error.getCode()));
    ResponseCode code =
        missing ? ResponseCode.MISSING_REQUIRED_FIELD : ResponseCode.INVALID_ARGUMENTS;
    List<ErrorDetail> errors =
        fieldErrors.stream().map(GlobalExceptionHandler::toErrorDetail).toList();
    return respond(
        ex,
        ErrorResponseBuilder.buildErrorResponseWithErrors(
            code.getDetail(), errors, pathOf(request), code));
  }

  private static String pathOf(WebRequest request) {
    return ((ServletWebRequest) request).getRequest().getRequestURI();
  }

  private static ResponseEntity<Object> respond(
      Exception ex, ResponseCode code, WebRequest request) {
    return respond(
        ex, ErrorResponseBuilder.buildErrorResponse(code.getDetail(), pathOf(request), code));
  }

  private static ResponseEntity<Object> respond(Exception ex, ErrorResponse response) {
    if (response.status() >= HttpStatus.INTERNAL_SERVER_ERROR.value()) {
      log.error(
          "Server error: code={}, reference={}, path={}",
          response.code(),
          response.errorReference(),
          response.instance(),
          ex);
    } else {
      log.warn(
          "Client error: code={}, reference={}, path={}, message={}",
          response.code(),
          response.errorReference(),
          response.instance(),
          ex.getMessage());
    }
    return ErrorResponseBuilder.buildResponse(response);
  }

  private static ErrorDetail toErrorDetail(FieldError error) {
    String message =
        TYPE_MISMATCH_CODE.equals(error.getCode())
            ? INVALID_FORMAT_MESSAGE
            : error.getDefaultMessage();
    return new ErrorDetail(error.getField(), message, error.getRejectedValue());
  }

  private static ResponseCode toResponseCode(HttpStatusCode status) {
    if (status.is5xxServerError()) {
      return ResponseCode.INTERNAL_SERVER_ERROR;
    }
    if (status.value() == HttpStatus.NOT_FOUND.value()) {
      return ResponseCode.RESOURCE_NOT_FOUND;
    }
    return ResponseCode.INVALID_ARGUMENTS;
  }
}
