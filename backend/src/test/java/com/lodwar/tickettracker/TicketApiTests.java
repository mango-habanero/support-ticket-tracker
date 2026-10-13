package com.lodwar.tickettracker;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import com.lodwar.tickettracker.database.entities.Ticket;
import com.lodwar.tickettracker.database.repositories.TicketRepository;
import com.lodwar.tickettracker.enums.TicketPriority;
import com.lodwar.tickettracker.enums.TicketStatus;

@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
@SpringBootTest
@Transactional
class TicketApiTests {

  private final MockMvc mockMvc;
  private final TicketRepository repository;

  @Autowired
  TicketApiTests(MockMvc mockMvc, TicketRepository repository) {
    this.mockMvc = mockMvc;
    this.repository = repository;
  }

  @Test
  void createRejectsBlankTitle() throws Exception {
    mockMvc
        .perform(
            post("/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"priority": "LOW", "title": "   "}
                    """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value("MISSING_REQUIRED_FIELD"))
        .andExpect(jsonPath("$.errors[0].field").value("title"));

    assertThat(repository.count()).isZero();
  }

  @Test
  void createReturnsCreatedTicket() throws Exception {
    mockMvc
        .perform(
            post("/tickets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"description": "The printer does not respond.", "priority": "HIGH", "title": "Printer offline"}
                    """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("SUCCESS"))
        .andExpect(jsonPath("$.data.id").isNumber())
        .andExpect(jsonPath("$.data.title").value("Printer offline"))
        .andExpect(jsonPath("$.data.description").value("The printer does not respond."))
        .andExpect(jsonPath("$.data.priority").value("HIGH"))
        .andExpect(jsonPath("$.data.status").value("OPEN"));

    assertThat(repository.count()).isEqualTo(1);
  }

  @Test
  void statisticsCountTicketsByStatus() throws Exception {
    saveTicket(TicketStatus.OPEN);
    saveTicket(TicketStatus.OPEN);
    saveTicket(TicketStatus.IN_PROGRESS);
    saveTicket(TicketStatus.CLOSED);

    mockMvc
        .perform(get("/tickets/stats"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data[0].status").value("OPEN"))
        .andExpect(jsonPath("$.data[0].count").value(2))
        .andExpect(jsonPath("$.data[1].status").value("IN_PROGRESS"))
        .andExpect(jsonPath("$.data[1].count").value(1))
        .andExpect(jsonPath("$.data[2].status").value("CLOSED"))
        .andExpect(jsonPath("$.data[2].count").value(1));
  }

  @Test
  void statisticsReportEveryStatusForEmptyTable() throws Exception {
    mockMvc
        .perform(get("/tickets/stats"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.data.length()").value(3))
        .andExpect(jsonPath("$.data[0].status").value("OPEN"))
        .andExpect(jsonPath("$.data[0].count").value(0))
        .andExpect(jsonPath("$.data[1].status").value("IN_PROGRESS"))
        .andExpect(jsonPath("$.data[1].count").value(0))
        .andExpect(jsonPath("$.data[2].status").value("CLOSED"))
        .andExpect(jsonPath("$.data[2].count").value(0));
  }

  @Test
  void updateRejectsMoveOutOfClosedStatus() throws Exception {
    Ticket ticket = saveTicket(TicketStatus.CLOSED);

    mockMvc
        .perform(
            patch("/tickets/{id}", ticket.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                    {"status": "OPEN"}
                    """))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("INVALID_STATE"));
  }

  private Ticket saveTicket(TicketStatus status) {
    Ticket ticket =
        Ticket.builder().priority(TicketPriority.MEDIUM).title("Ticket " + status).build();

    if (status != TicketStatus.OPEN) {
      ticket.changeStatus(status);
    }

    return repository.save(ticket);
  }
}
