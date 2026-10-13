package com.lodwar.tickettracker.utilities.database;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import com.lodwar.tickettracker.dtos.requests.filters.BaseFilter;

import lombok.experimental.UtilityClass;

@UtilityClass
public class FilterUtilities {

  public static Pageable buildPageable(BaseFilter filter, Sort sort) {
    int zeroIndexedPage = filter.getPage() - 1;
    return PageRequest.of(zeroIndexedPage, filter.getLimit(), sort);
  }
}
