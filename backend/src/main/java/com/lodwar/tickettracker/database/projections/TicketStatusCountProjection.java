package com.lodwar.tickettracker.database.projections;

import com.lodwar.tickettracker.enums.TicketStatus;

public interface TicketStatusCountProjection {
  Long getCount();

  TicketStatus getStatus();
}
