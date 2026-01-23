package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.ExpenseType
import com.ohapps.remasapi.json.Views
import org.valiktor.functions.hasSize
import org.valiktor.validate
import java.math.BigDecimal

@NoArgConstructor
data class DefaultExpense(
    @JsonView(Views.Read::class)
    var id: String?,
    @JsonView(Views.Base::class)
    var description: String,
    @JsonView(Views.Base::class)
    var amount: BigDecimal,
    @JsonView(Views.Base::class)
    var expenseType: ExpenseType
) {
    init {
        validate(this) {
            validate(DefaultExpense::description).hasSize(min = 1, max = 100)
        }
    }
}
