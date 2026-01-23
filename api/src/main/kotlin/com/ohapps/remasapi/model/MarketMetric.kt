package com.ohapps.remasapi.model

import com.ohapps.remasapi.annotation.NoArgConstructor

@NoArgConstructor
data class MarketMetric(var id: String, var question: MarketQuestion, var metricValue: String)
