package com.lodwar.tickettracker.dtos.requests.filters;

import com.lodwar.tickettracker.enums.TicketStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketFilter extends BaseFilter {
  private TicketStatus status;
}
