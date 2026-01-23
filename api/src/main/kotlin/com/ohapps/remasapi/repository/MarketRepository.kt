package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.MarketEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MarketRepository : JpaRepository<MarketEntity, String> {
    fun findAllByUserId(userId: String): List<MarketEntity>
    fun findTop5ByUserIdAndUpdatedDateNotNullOrderByUpdatedDateDesc(userId: String): List<MarketEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<MarketEntity>

    @Modifying
    @Query("update market set parent_id = null where parent_id = :parentId", nativeQuery = true)
    fun clearParentMarket(parentId: String)
}
