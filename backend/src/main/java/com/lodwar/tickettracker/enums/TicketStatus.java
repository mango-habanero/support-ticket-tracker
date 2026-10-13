package com.lodwar.tickettracker.enums;

import java.util.Arrays;

public enum TicketStatus {
  OPEN,
  IN_PROGRESS,
  CLOSED;

  public boolean canTransitionTo(TicketStatus target) {
    return switch (this) {
      case CLOSED -> false;
      case IN_PROGRESS -> target == CLOSED;
      case OPEN -> target == CLOSED || target == IN_PROGRESS;
    };
  }

  public boolean isTerminal() {
    return Arrays.stream(values()).noneMatch(this::canTransitionTo);
  }
}
