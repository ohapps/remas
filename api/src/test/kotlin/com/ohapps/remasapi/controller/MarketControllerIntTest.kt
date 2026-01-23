package com.ohapps.remasapi.controller

import com.ohapps.remasapi.BaseIntegrationTest
import com.ohapps.remasapi.repository.MarketRepository
import com.ohapps.remasapi.repository.PropertyRepository
import com.ohapps.remasapi.utils.TestUser
import com.ohapps.remasapi.utils.deleteJson
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus

class MarketControllerIntTest : BaseIntegrationTest() {

    @Autowired
    lateinit var propertyRepository: PropertyRepository

    @Autowired
    lateinit var marketRepository: MarketRepository

    @Nested
    inner class DeleteMarket {
        @Test
        fun `deleting market will set market id to null on associated properties`() {
            val properties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(properties).isNotEmpty
            val property = properties.first()

            val markets = marketRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(markets).isNotEmpty
            val market = markets.first()

            property.marketId = market.id
            propertyRepository.saveAndFlush(property)

            val propertyBeforeDelete = propertyRepository.findById(property.id!!).get()
            assertThat(propertyBeforeDelete.marketId).isEqualTo(market.id)

            val response = restTemplate.deleteJson<Unit>("/markets/${market.id}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)

            val deletedMarket = marketRepository.findById(market.id!!)

            assertThat(deletedMarket.isPresent).isFalse

            val propertyAfterDelete = propertyRepository.findById(property.id!!).get()
            assertThat(propertyAfterDelete.marketId).isNull()
        }
    }
}
