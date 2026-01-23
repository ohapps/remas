package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.UnitType
import org.hibernate.annotations.GenericGenerator
import java.math.BigDecimal
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "market_rent")
data class MarketRentEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String?,

    @ManyToOne
    @JoinColumn(name = "market_id")
    var market: MarketEntity,

    @Column(name = "unit_type", nullable = false)
    @Enumerated(EnumType.STRING)
    var unitType: UnitType,

    @Column(name = "bedrooms")
    var bedrooms: Int,

    @Column(name = "bathrooms")
    var bathrooms: Int,

    @Column(name = "square_feet")
    var squareFeet: Double,

    @Column(name = "rent_low")
    var rentLow: BigDecimal,

    @Column(name = "rent_high")
    var rentHigh: BigDecimal
)
