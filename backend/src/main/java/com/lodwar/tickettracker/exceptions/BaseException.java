package com.lodwar.tickettracker.exceptions;

import java.io.Serial;

import com.lodwar.tickettracker.enums.ResponseCode;

import lombok.Getter;

@Getter
public abstract class BaseException extends RuntimeException {

  @Serial private static final long serialVersionUID = 1L;

  private final ResponseCode responseCode;

  protected BaseException(String detail, ResponseCode responseCode) {
    super(detail);
    this.responseCode = responseCode;
  }
}
