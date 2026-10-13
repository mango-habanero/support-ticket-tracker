package com.lodwar.tickettracker.enums;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResponseCode {
  INTERNAL_SERVER_ERROR(
      "An unexpected error occurred while processing your request.",
      HttpStatus.INTERNAL_SERVER_ERROR),
  INVALID_ARGUMENTS("Request contains invalid or incomplete arguments.", HttpStatus.BAD_REQUEST),
  INVALID_STATE(
      "The resource is in an invalid state for the requested operation.", HttpStatus.CONFLICT),
  MISSING_REQUIRED_FIELD("Required field is missing in the request.", HttpStatus.BAD_REQUEST),
  RESOURCE_NOT_FOUND("The specified resource does not exist.", HttpStatus.NOT_FOUND);

  private final String detail;
  private final HttpStatus httpStatus;

  public String getTitle() {
    return httpStatus.getReasonPhrase();
  }
}
