package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.ExpenseType
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import java.math.RoundingMode
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "default_expense")
data class DefaultExpenseEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(name = "description")
    var description: String,

    @Column(name = "amount")
    var amount: BigDecimal,

    @Column(name = "expenseType")
    @Enumerated(EnumType.STRING)
    var expenseType: ExpenseType
) {
    fun calculateMonthlyAmount(propertyEntity: PropertyEntity): BigDecimal {
        return when (expenseType) {
            ExpenseType.MONTHLY -> amount
            ExpenseType.YEARLY -> amount.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP)
            ExpenseType.PERCENT_OF_RENT -> propertyEntity.monthlyRent?.let { it.multiply(amount.divide(BigDecimal.valueOf(100))) }
                ?: BigDecimal.ZERO
        }
    }
}
