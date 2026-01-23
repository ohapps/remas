package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import java.math.BigDecimal
import java.time.LocalDate
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "property")
data class PropertyEntity(
    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(nullable = false)
    var address: String,

    @Column(nullable = false)
    var city: String,

    @Column(nullable = false)
    var state: String,

    @Column(nullable = false)
    var zipCode: String,

    @Column(nullable = false)
    var units: Int,

    @Column
    var monthlyRent: BigDecimal?,

    @Column
    var arv: BigDecimal?,

    @Column
    var purchased: LocalDate?,

    @Column
    var inService: LocalDate?,

    @Column
    var watchlist: Boolean,

    @Column
    var listingUrl: String,

    @Column
    var archived: Boolean,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "property", orphanRemoval = true)
    var offers: MutableList<OfferEntity>,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "property", orphanRemoval = true)
    var expenses: MutableList<ExpenseEntity>,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "property", orphanRemoval = true)
    var rehabEstimates: MutableList<RehabEstimateEntity>,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "property", orphanRemoval = true)
    @OrderBy("updatedDate DESC")
    var notes: MutableList<PropertyNoteEntity>,

    @Column
    var marketId: String? = null
) : BaseEntity()
