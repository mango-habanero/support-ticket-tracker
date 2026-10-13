package com.lodwar.tickettracker.dtos.requests.filters;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class BaseFilter {

  @Max(100) @Min(1) private int limit = 20;

  @Min(1) private int page = 1;
}
