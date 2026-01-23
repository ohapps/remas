package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import javax.persistence.*

@NoArgConstructor
@Entity
@Table(name = "app_user")
data class UserEntity(
    @Id
    var id: String,

    @Column(nullable = false)
    var username: String,

    @OneToMany(cascade = [CascadeType.ALL], mappedBy = "user")
    var markets: List<MarketEntity>
)
