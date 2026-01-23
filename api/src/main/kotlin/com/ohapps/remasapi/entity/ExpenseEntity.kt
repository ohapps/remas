package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "expense")
data class ExpenseEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String,

    @ManyToOne
    @JoinColumn(name = "property_id")
    var property: PropertyEntity,

    @Column(name = "description")
    var description: String,

    @Column(name = "monthly_amount")
    var monthlyAmount: BigDecimal
)
