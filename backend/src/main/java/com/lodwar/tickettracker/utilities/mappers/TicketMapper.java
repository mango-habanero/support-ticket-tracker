package com.lodwar.tickettracker.utilities.mappers;

import org.mapstruct.Mapper;

import com.lodwar.tickettracker.database.entities.Ticket;
import com.lodwar.tickettracker.dtos.responses.tickets.TicketResponse;

@Mapper(componentModel = "spring")
public interface TicketMapper {

  TicketResponse toResponse(Ticket ticket);
}
