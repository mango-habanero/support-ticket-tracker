package com.lodwar.tickettracker.dtos.responses.tickets;

import java.time.OffsetDateTime;

import com.lodwar.tickettracker.enums.TicketPriority;
import com.lodwar.tickettracker.enums.TicketStatus;

public record TicketResponse(
    Long id,
    OffsetDateTime createdAt,
    String description,
    TicketPriority priority,
    TicketStatus status,
    String title) {}
