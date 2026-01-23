package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.json.Views
import java.math.BigDecimal
import java.time.LocalDate

@NoArgConstructor
data class Property(
    @JsonView(Views.Read::class)
    var id: String?,
    @JsonView(Views.Base::class)
    var address: String,
    @JsonView(Views.Base::class)
    var city: String,
    @JsonView(Views.Base::class)
    var state: String,
    @JsonView(Views.Base::class)
    var zipCode: String,
    @JsonView(Views.Base::class)
    var units: Int,
    @JsonView(Views.Base::class)
    var monthlyRent: BigDecimal?,
    @JsonView(Views.Base::class)
    var arv: BigDecimal?,
    @JsonView(Views.Base::class)
    @JsonFormat(pattern = "MM/dd/yyyy")
    var purchased: LocalDate?,
    @JsonView(Views.Base::class)
    @JsonFormat(pattern = "MM/dd/yyyy")
    var inService: LocalDate?,
    @JsonView(Views.Base::class)
    var watchlist: Boolean,
    @JsonView(Views.Base::class)
    var listingUrl: String,
    @JsonView(Views.Read::class)
    var archived: Boolean,
    @JsonView(Views.Read::class)
    var offers: List<Offer>?,
    @JsonView(Views.Read::class)
    var expenses: List<Expense>?,
    @JsonView(Views.Read::class)
    var rehabEstimates: List<RehabEstimate>?,
    @JsonView(Views.Read::class)
    var notes: List<PropertyNote>?,
    @JsonView(Views.Read::class)
    var metrics: List<PropertyMetric>?,
    @JsonView(Views.Base::class)
    var marketId: String?
)
