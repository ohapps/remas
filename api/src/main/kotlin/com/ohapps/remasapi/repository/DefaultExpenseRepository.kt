package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.DefaultExpenseEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface DefaultExpenseRepository : JpaRepository<DefaultExpenseEntity, String> {
    fun findAllByUserId(userId: String): List<DefaultExpenseEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<DefaultExpenseEntity>
}
