package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.TravelLogEntity
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface TravelLogRepository : JpaRepository<TravelLogEntity, String> {
    fun findAllByUserId(userId: String, by: Sort): List<TravelLogEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<TravelLogEntity>
}
