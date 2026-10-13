package com.lodwar.tickettracker.dtos.requests.tickets;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.lodwar.tickettracker.enums.TicketPriority;

public record CreateTicketRequest(
    String description,
    @NotNull TicketPriority priority,
    @NotBlank @Size(max = 255) String title) {}
