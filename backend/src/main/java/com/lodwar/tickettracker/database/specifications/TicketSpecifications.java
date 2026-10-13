package com.lodwar.tickettracker.database.specifications;

import org.springframework.data.jpa.domain.Specification;

import com.lodwar.tickettracker.database.entities.Ticket;
import com.lodwar.tickettracker.dtos.requests.filters.TicketFilter;

import lombok.experimental.UtilityClass;

@UtilityClass
public class TicketSpecifications {

  private static final String FIELD_STATUS = "status";

  public static Specification<Ticket> buildSpecification(TicketFilter filter) {
    return (root, query, criteriaBuilder) ->
        filter.getStatus() == null
            ? criteriaBuilder.conjunction()
            : criteriaBuilder.equal(root.get(FIELD_STATUS), filter.getStatus());
  }
}
