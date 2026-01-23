package com.ohapps.remasapi.model

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.LocationType

@NoArgConstructor
data class Market(
    var id: String?,
    var description: String,
    var locationType: LocationType,
    var location: String,
    var metrics: List<MarketMetric>?,
    var rents: List<MarketRent>?,
    var parentMarket: Market?
)
