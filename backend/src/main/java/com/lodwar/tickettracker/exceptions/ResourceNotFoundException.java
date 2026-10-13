package com.lodwar.tickettracker.exceptions;

import java.io.Serial;

import com.lodwar.tickettracker.enums.ResponseCode;

public class ResourceNotFoundException extends BaseException {

  @Serial private static final long serialVersionUID = 1L;

  public ResourceNotFoundException(String detail) {
    super(detail, ResponseCode.RESOURCE_NOT_FOUND);
  }
}
