package com.lodwar.tickettracker.database.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.lodwar.tickettracker.database.entities.bases.BaseEntity;
import com.lodwar.tickettracker.enums.TicketPriority;
import com.lodwar.tickettracker.enums.TicketStatus;
import com.lodwar.tickettracker.exceptions.BusinessRuleException;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "tickets")
public class Ticket extends BaseEntity {

  @Column(name = "description")
  private String description;

  @Column(name = "priority", nullable = false, length = 50)
  @Enumerated(EnumType.STRING)
  @NotNull private TicketPriority priority;

  @Column(name = "status", nullable = false, length = 50)
  @Enumerated(EnumType.STRING)
  @NotNull private TicketStatus status = TicketStatus.OPEN;

  @Column(name = "title", nullable = false)
  @NotBlank private String title;

  @Builder
  private Ticket(String description, TicketPriority priority, String title) {
    this.description = description;
    this.priority = priority;
    this.title = title;
  }

  public void changePriority(TicketPriority newPriority) {
    if (status.isTerminal()) {
      throw new BusinessRuleException(
          "Ticket " + getId() + " is " + status + " and its priority cannot change.");
    }
    this.priority = newPriority;
  }

  public void changeStatus(TicketStatus target) {
    if (!status.canTransitionTo(target)) {
      throw new BusinessRuleException(
          "Ticket " + getId() + " cannot move from " + status + " to " + target + ".");
    }
    this.status = target;
  }
}
