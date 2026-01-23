package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.TransactionType
import javax.persistence.*

@Entity
@NoArgConstructor
@Table(name = "ledger_category")
data class LedgerCategoryEntity(
    @Column
    var category: String,

    @Column
    @Enumerated(EnumType.STRING)
    var transactionType: TransactionType
) : BaseEntity()
