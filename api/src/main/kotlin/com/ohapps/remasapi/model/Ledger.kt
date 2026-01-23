package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonFormat
import com.ohapps.remasapi.annotation.NoArgConstructor
import org.valiktor.functions.hasSize
import org.valiktor.validate
import java.math.BigDecimal
import java.time.LocalDate

@NoArgConstructor
data class Ledger(
    var id: String?,
    @JsonFormat(pattern = "MM/dd/yyyy")
    var transactionDate: LocalDate,
    var payorPayee: String,
    var description: String,
    var categoryId: String,
    var categoryDescription: String?,
    var transactionType: String?,
    var amount: BigDecimal,
    var checkNo: String?,
    var propertyId: String?,
    var propertyDescription: String?
) {
    init {
        validate(this) {
            validate(Ledger::payorPayee).hasSize(min = 1, max = 100)
            validate(Ledger::description).hasSize(min = 1, max = 100)
        }
    }
}
