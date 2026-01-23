package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.enum.LocationType
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "market")
data class MarketEntity(
    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(nullable = false)
    var description: String,

    @Column(name = "location_type", nullable = false)
    @Enumerated(EnumType.STRING)
    var locationType: LocationType,

    @Column
    var location: String,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "market")
    var metrics: MutableList<MarketMetricEntity>,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "market", orphanRemoval = true)
    var rents: MutableList<MarketRentEntity>,

    @ManyToOne
    @JoinColumn(name = "parent_id")
    var parentMarket: MarketEntity?
) : BaseEntity()
