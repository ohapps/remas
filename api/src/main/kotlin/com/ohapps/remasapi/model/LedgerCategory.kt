package com.ohapps.remasapi.model

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.TransactionType

@NoArgConstructor
data class LedgerCategory(
    var id: String?,
    var category: String,
    var transactionType: TransactionType
)
