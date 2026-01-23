package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.*

@Entity
@NoArgConstructor
@Table(name = "ledger")
data class LedgerEntity(
    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column
    var transactionDate: LocalDate,

    @Column
    var payorPayee: String,

    @Column
    var description: String,

    @ManyToOne
    @JoinColumn(name = "category_id")
    var category: LedgerCategoryEntity,

    @Column
    var amount: BigDecimal,

    @Column
    var checkNo: String?,

    @ManyToOne
    @JoinColumn(name = "property_id")
    var property: PropertyEntity?
) : BaseEntity()
