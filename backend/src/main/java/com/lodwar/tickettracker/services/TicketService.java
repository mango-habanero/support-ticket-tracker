package com.lodwar.tickettracker.services;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lodwar.tickettracker.database.entities.Ticket;
import com.lodwar.tickettracker.database.projections.TicketStatusCountProjection;
import com.lodwar.tickettracker.database.repositories.TicketRepository;
import com.lodwar.tickettracker.database.specifications.TicketSpecifications;
import com.lodwar.tickettracker.dtos.requests.filters.TicketFilter;
import com.lodwar.tickettracker.dtos.requests.tickets.CreateTicketRequest;
import com.lodwar.tickettracker.dtos.requests.tickets.UpdateTicketRequest;
import com.lodwar.tickettracker.dtos.responses.tickets.TicketResponse;
import com.lodwar.tickettracker.dtos.responses.tickets.TicketStatusCountResponse;
import com.lodwar.tickettracker.enums.TicketStatus;
import com.lodwar.tickettracker.exceptions.ResourceNotFoundException;
import com.lodwar.tickettracker.utilities.database.FilterUtilities;
import com.lodwar.tickettracker.utilities.mappers.TicketMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class TicketService {

  private static final Sort NEWEST_FIRST = Sort.by(Sort.Direction.DESC, "createdAt", "id");

  private final TicketMapper mapper;
  private final TicketRepository repository;

  @Transactional
  public TicketResponse create(CreateTicketRequest request) {
    Ticket ticket =
        repository.save(
            Ticket.builder()
                .description(request.description())
                .priority(request.priority())
                .title(request.title())
                .build());
    log.info("Ticket created: id={}, priority={}", ticket.getId(), ticket.getPriority());
    return mapper.toResponse(ticket);
  }

  @Transactional(readOnly = true)
  public Page<TicketResponse> search(TicketFilter filter) {
    Specification<Ticket> spec = TicketSpecifications.buildSpecification(filter);
    Pageable pageable = FilterUtilities.buildPageable(filter, NEWEST_FIRST);
    return repository.findAll(spec, pageable).map(mapper::toResponse);
  }

  @Transactional(readOnly = true)
  public List<TicketStatusCountResponse> statistics() {
    Map<TicketStatus, Long> counts =
        repository.countGroupedByStatus().stream()
            .collect(
                Collectors.toMap(
                    TicketStatusCountProjection::getStatus, TicketStatusCountProjection::getCount));
    return Arrays.stream(TicketStatus.values())
        .map(status -> new TicketStatusCountResponse(counts.getOrDefault(status, 0L), status))
        .toList();
  }

  @Transactional
  public TicketResponse update(Long id, UpdateTicketRequest request) {
    Ticket ticket = getForUpdate(id);
    if (request.priority() != null) {
      ticket.changePriority(request.priority());
    }
    if (request.status() != null && request.status() != ticket.getStatus()) {
      TicketStatus previous = ticket.getStatus();
      ticket.changeStatus(request.status());
      log.info("Ticket status changed: id={}, from={}, to={}", id, previous, ticket.getStatus());
    }
    return mapper.toResponse(ticket);
  }

  private Ticket getForUpdate(Long id) {
    return repository
        .findForUpdateById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " not found."));
  }
}
