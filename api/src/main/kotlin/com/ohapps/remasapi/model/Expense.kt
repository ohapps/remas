package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.json.Views
import java.math.BigDecimal

@NoArgConstructor
data class Expense(
    @JsonView(Views.Read::class)
    var id: String?,
    @JsonView(Views.Base::class)
    var description: String,
    @JsonView(Views.Base::class)
    var monthlyAmount: BigDecimal
)
