package com.lodwar.tickettracker.database.repositories;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import com.lodwar.tickettracker.database.entities.Ticket;
import com.lodwar.tickettracker.database.projections.TicketStatusCountProjection;

public interface TicketRepository
    extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

  @Query("SELECT t.status AS status, COUNT(t) AS count FROM Ticket t GROUP BY t.status")
  List<TicketStatusCountProjection> countGroupedByStatus();

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  Optional<Ticket> findForUpdateById(Long id);
}
