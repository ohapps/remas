package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.enum.MetricUnit
import com.ohapps.remasapi.json.Views
import java.math.BigDecimal

data class PropertyMetric(
    @JsonView(Views.Read::class)
    val description: String,
    @JsonView(Views.Read::class)
    val metric: BigDecimal,
    @JsonView(Views.Read::class)
    val metricUnit: MetricUnit,
    @JsonView(Views.Read::class)
    val helpText: String
)
