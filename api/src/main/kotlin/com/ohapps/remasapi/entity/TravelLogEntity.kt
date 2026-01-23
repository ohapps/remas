package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import java.time.LocalDate
import javax.persistence.*

@Entity
@NoArgConstructor
@Table(name = "travel_log")
data class TravelLogEntity(
    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column
    var travelDate: LocalDate,

    @Column
    var description: String,

    @Column
    var miles: Double
) : BaseEntity()
