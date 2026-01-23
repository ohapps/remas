package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.PropertyEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface PropertyRepository : JpaRepository<PropertyEntity, String> {
    fun findAllByUserId(userId: String): List<PropertyEntity>
    fun findTop5ByUserIdAndUpdatedDateNotNullOrderByUpdatedDateDesc(userId: String): List<PropertyEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<PropertyEntity>

    @Modifying
    @Query("update property set market_id = null where market_id = :marketId", nativeQuery = true)
    fun clearMarketId(marketId: String)
}
