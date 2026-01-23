package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.LedgerEntity
import org.springframework.data.domain.Sort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface LedgerRepository : JpaRepository<LedgerEntity, String> {
    fun findAllByUserId(userId: String, by: Sort = Sort.by(Sort.Direction.DESC, "transactionDate")): List<LedgerEntity>
    fun findAllByIdAndUserId(id: String, userId: String): Optional<LedgerEntity>
}
