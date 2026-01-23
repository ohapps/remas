package com.ohapps.remasapi.model

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.UnitType
import java.math.BigDecimal

@NoArgConstructor
data class MarketRent(
    var id: String?,
    var unitType: UnitType,
    var bedrooms: Int,
    var bathrooms: Int,
    var squareFeet: Double,
    var rentLow: BigDecimal,
    var rentHigh: BigDecimal
)
