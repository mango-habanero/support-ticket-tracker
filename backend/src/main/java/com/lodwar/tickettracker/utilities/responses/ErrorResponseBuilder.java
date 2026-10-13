package com.lodwar.tickettracker.utilities.responses;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.lodwar.tickettracker.dtos.responses.api.ErrorResponse;
import com.lodwar.tickettracker.dtos.responses.api.ErrorResponse.ErrorDetail;
import com.lodwar.tickettracker.enums.ResponseCode;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ErrorResponseBuilder {

  private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
  private static final int REFERENCE_SUFFIX_LENGTH = 6;

  public static ErrorResponse buildErrorResponse(
      String detail, String requestPath, ResponseCode responseCode) {
    return ErrorResponse.from(detail, generateErrorReference(), requestPath, responseCode);
  }

  public static ErrorResponse buildErrorResponseWithErrors(
      String detail, List<ErrorDetail> errors, String requestPath, ResponseCode responseCode) {
    return ErrorResponse.withErrors(
        detail, generateErrorReference(), errors, requestPath, responseCode);
  }

  public static ResponseEntity<Object> buildResponse(ErrorResponse errorResponse) {
    return ResponseEntity.status(errorResponse.status())
        .contentType(MediaType.APPLICATION_PROBLEM_JSON)
        .body(errorResponse);
  }

  private static String generateErrorReference() {
    String suffix =
        UUID.randomUUID()
            .toString()
            .replace("-", "")
            .substring(0, REFERENCE_SUFFIX_LENGTH)
            .toUpperCase();
    return "ERR-" + LocalDate.now().format(DATE_FORMATTER) + "-" + suffix;
  }
}
