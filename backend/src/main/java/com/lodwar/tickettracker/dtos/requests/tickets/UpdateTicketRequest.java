package com.lodwar.tickettracker.dtos.requests.tickets;

import jakarta.validation.constraints.AssertTrue;

import com.lodwar.tickettracker.enums.TicketPriority;
import com.lodwar.tickettracker.enums.TicketStatus;

public record UpdateTicketRequest(TicketPriority priority, TicketStatus status) {

  @AssertTrue(message = "At least one of status or priority is required.") public boolean isStatusOrPriorityPresent() {
    return priority != null || status != null;
  }
}
