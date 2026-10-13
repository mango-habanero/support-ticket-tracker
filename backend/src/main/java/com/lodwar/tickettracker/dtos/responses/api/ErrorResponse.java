package com.lodwar.tickettracker.dtos.responses.api;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.lodwar.tickettracker.enums.ResponseCode;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    String code,
    String detail,
    String errorReference,
    List<ErrorDetail> errors,
    String instance,
    int status,
    String title) {

  public static ErrorResponse from(
      String detail, String errorReference, String instance, ResponseCode responseCode) {
    return withErrors(detail, errorReference, null, instance, responseCode);
  }

  public static ErrorResponse withErrors(
      String detail,
      String errorReference,
      List<ErrorDetail> errors,
      String instance,
      ResponseCode responseCode) {
    return new ErrorResponse(
        responseCode.name(),
        detail,
        errorReference,
        errors,
        instance,
        responseCode.getHttpStatus().value(),
        responseCode.getTitle());
  }

  @JsonInclude(JsonInclude.Include.NON_NULL)
  public record ErrorDetail(String field, String message, Object rejectedValue) {}
}
