package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.LedgerCategoryEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface LedgerCategoryRepository : JpaRepository<LedgerCategoryEntity, String>
