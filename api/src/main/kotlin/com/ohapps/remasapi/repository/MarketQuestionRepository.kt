package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.MarketQuestionEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface MarketQuestionRepository : JpaRepository<MarketQuestionEntity, String> {
    fun findAllByUserId(userId: String): List<MarketQuestionEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<MarketQuestionEntity>
}
