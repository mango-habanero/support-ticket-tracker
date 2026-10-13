package com.lodwar.tickettracker.dtos.responses.tickets;

import com.lodwar.tickettracker.enums.TicketStatus;

public record TicketStatusCountResponse(Long count, TicketStatus status) {}
