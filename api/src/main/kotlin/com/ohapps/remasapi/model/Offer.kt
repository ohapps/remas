package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.json.Views
import java.math.BigDecimal
import java.math.RoundingMode

@NoArgConstructor
data class Offer(
    @JsonView(Views.Read::class)
    var id: String?,
    @JsonView(Views.Base::class)
    var description: String,
    @JsonView(Views.Base::class)
    var purchasePrice: BigDecimal,
    @JsonView(Views.Base::class)
    var cashDown: BigDecimal,
    @JsonView(Views.Base::class)
    var loanAmount: BigDecimal,
    @JsonView(Views.Base::class)
    var loanYears: Double,
    @JsonView(Views.Base::class)
    var loanRate: Double,
    @JsonView(Views.Base::class)
    var mortgagePayment: BigDecimal,
    @JsonView(Views.Base::class)
    var principalPayDown: BigDecimal,
    @JsonView(Views.Base::class)
    var closingCost: BigDecimal,
    @JsonView(Views.Base::class)
    var active: Boolean?
) {
    @JsonView(Views.Base::class)
    fun getCashDownPercent() = if (cashDown > BigDecimal.ZERO) purchasePrice.divide(cashDown, 2, RoundingMode.HALF_UP) else BigDecimal.ZERO
}
