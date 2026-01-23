package com.ohapps.remasapi.model

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.MarketAnswerType

@NoArgConstructor
data class MarketQuestion(
    var id: String?,
    var question: String,
    var answerType: MarketAnswerType
)
