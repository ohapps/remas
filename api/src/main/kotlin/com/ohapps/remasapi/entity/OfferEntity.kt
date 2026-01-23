package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "offer")
data class OfferEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String,

    @ManyToOne
    @JoinColumn(name = "property_id")
    var property: PropertyEntity,

    @Column(name = "description")
    var description: String,

    @Column(name = "purchase_price")
    var purchasePrice: BigDecimal,

    @Column(name = "cash_down")
    var cashDown: BigDecimal,

    @Column(name = "loan_amount")
    var loanAmount: BigDecimal,

    @Column(name = "loan_years")
    var loanYears: Double,

    @Column(name = "loan_rate")
    var loanRate: Double,

    @Column(name = "mortgage_payment")
    var mortgagePayment: BigDecimal,

    @Column(name = "principal_pay_down")
    var principalPayDown: BigDecimal,

    @Column(name = "closing_cost")
    var closingCost: BigDecimal,

    @Column(name = "active")
    var active: Boolean
)
