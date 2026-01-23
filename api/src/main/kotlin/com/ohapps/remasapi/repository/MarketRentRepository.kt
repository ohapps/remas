package com.ohapps.remasapi.repository

import com.ohapps.remasapi.entity.MarketRentEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface MarketRentRepository : JpaRepository<MarketRentEntity, String>
