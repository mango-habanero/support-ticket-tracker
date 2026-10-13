package com.lodwar.tickettracker.exceptions;

import java.io.Serial;

import com.lodwar.tickettracker.enums.ResponseCode;

public class BusinessRuleException extends BaseException {

  @Serial private static final long serialVersionUID = 1L;

  public BusinessRuleException(String detail) {
    super(detail, ResponseCode.INVALID_STATE);
  }
}
