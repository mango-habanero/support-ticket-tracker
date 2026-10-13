package com.lodwar.tickettracker.controllers;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lodwar.tickettracker.dtos.requests.filters.TicketFilter;
import com.lodwar.tickettracker.dtos.requests.tickets.CreateTicketRequest;
import com.lodwar.tickettracker.dtos.requests.tickets.UpdateTicketRequest;
import com.lodwar.tickettracker.dtos.responses.api.PaginatedResponse;
import com.lodwar.tickettracker.dtos.responses.api.SuccessResponse;
import com.lodwar.tickettracker.dtos.responses.tickets.TicketResponse;
import com.lodwar.tickettracker.dtos.responses.tickets.TicketStatusCountResponse;
import com.lodwar.tickettracker.services.TicketService;

import lombok.RequiredArgsConstructor;

@RequestMapping("/tickets")
@RequiredArgsConstructor
@RestController
public class TicketController {

  private final TicketService ticketService;

  @PostMapping
  public ResponseEntity<SuccessResponse<TicketResponse>> create(
      @Valid @RequestBody CreateTicketRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(SuccessResponse.of(ticketService.create(request), "Ticket created."));
  }

  @GetMapping
  public ResponseEntity<PaginatedResponse<TicketResponse>> search(@Valid TicketFilter filter) {
    return ResponseEntity.ok(
        PaginatedResponse.from("Tickets retrieved.", ticketService.search(filter)));
  }

  @GetMapping("/stats")
  public ResponseEntity<SuccessResponse<List<TicketStatusCountResponse>>> statistics() {
    return ResponseEntity.ok(
        SuccessResponse.of(ticketService.statistics(), "Ticket statistics retrieved."));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<SuccessResponse<TicketResponse>> update(
      @PathVariable Long id, @Valid @RequestBody UpdateTicketRequest request) {
    return ResponseEntity.ok(
        SuccessResponse.of(ticketService.update(id, request), "Ticket updated."));
  }
}
