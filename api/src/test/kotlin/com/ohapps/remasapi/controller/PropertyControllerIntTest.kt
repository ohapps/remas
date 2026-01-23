package com.ohapps.remasapi.controller

import com.ohapps.remasapi.BaseIntegrationTest
import com.ohapps.remasapi.model.Ledger
import com.ohapps.remasapi.model.Property
import com.ohapps.remasapi.repository.MarketRepository
import com.ohapps.remasapi.repository.PropertyRepository
import com.ohapps.remasapi.utils.TestUser
import com.ohapps.remasapi.utils.postJson
import com.ohapps.remasapi.utils.putJson
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import java.math.BigDecimal
import java.util.*

class PropertyControllerIntTest : BaseIntegrationTest() {

    @Autowired
    lateinit var propertyRepository: PropertyRepository

    @Autowired
    lateinit var marketRepository: MarketRepository

    @Nested
    inner class ArchiveProperty {
        @Test
        fun `test that a user can archive a property`() {
            val existingProperties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingProperties).hasSize(1)

            val propertyToArchive = existingProperties.first()
            assertThat(propertyToArchive.archived).isFalse

            val response = restTemplate.putJson<Ledger>("/properties/${propertyToArchive.id}/archive", "", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)

            val updatedProperty = propertyRepository.findById(propertyToArchive.id!!).get()
            assertThat(updatedProperty.archived).isTrue
        }

        @Test
        fun `test that an invalid property id throws bad request exception`() {
            val response = restTemplate.putJson<String>("/properties/${UUID.randomUUID()}/archive", "", normalUserToken)
            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
            assertThat(response.body).isEqualTo("{\"message\":\"property not found in database\"}")
        }

        @Test
        fun `test that a user cannot archive another user's property`() {
            val existingProperties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingProperties).hasSize(1)

            val propertyToArchive = existingProperties.first()
            assertThat(propertyToArchive.archived).isFalse

            val response = restTemplate.putJson<String>("/properties/${propertyToArchive.id}/archive", "", otherUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
            assertThat(response.body).isEqualTo("{\"message\":\"property not found in database\"}")
        }
    }

    @Nested
    inner class UnarchiveProperty {
        @Test
        fun `test that a user can unarchive a property`() {
            val existingProperties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingProperties).hasSize(1)

            val propertyToUnarchive = existingProperties.first()
            propertyToUnarchive.archived = true
            propertyRepository.save(propertyToUnarchive)

            val response = restTemplate.putJson<Unit>("/properties/${propertyToUnarchive.id}/unarchive", "", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)

            val updatedProperty = propertyRepository.findById(propertyToUnarchive.id!!).get()
            assertThat(updatedProperty.archived).isFalse
        }

        @Test
        fun `test that an invalid property id throws bad request exception`() {
            val response = restTemplate.putJson<String>("/properties/${UUID.randomUUID()}/unarchive", "", normalUserToken)
            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
            assertThat(response.body).isEqualTo("{\"message\":\"property not found in database\"}")
        }

        @Test
        fun `test that a user cannot unarchive another user's property`() {
            val existingProperties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingProperties).hasSize(1)

            val propertyToUnarchive = existingProperties.first()

            val response = restTemplate.putJson<String>("/properties/${propertyToUnarchive.id}/unarchive", "", otherUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
            assertThat(response.body).isEqualTo("{\"message\":\"property not found in database\"}")
        }
    }

    @Nested
    inner class CreateProperty {
        @Test
        fun `create new property with a market id populated`() {
            val markets = marketRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(markets).isNotEmpty
            val market = markets.first()

            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000,
                "marketId": "${market.id}"
            }
            """.trimIndent()

            val response = restTemplate.postJson<Property>("/properties", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isNull()
            assertThat(property.expenses).isNotEmpty
            assertThat(property.rehabEstimates).isNull()
            assertThat(property.notes).isNull()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isEqualTo(market.id)

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isEqualTo(market.id)
        }

        @Test
        fun `create new property with a blank market id populated`() {
            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000,
                "marketId": ""
            }
            """.trimIndent()

            val response = restTemplate.postJson<Property>("/properties", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isNull()
            assertThat(property.expenses).isNotEmpty
            assertThat(property.rehabEstimates).isNull()
            assertThat(property.notes).isNull()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isNull()

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isNull()
        }

        @Test
        fun `create new property with market id missing from request body`() {
            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000
            }
            """.trimIndent()

            val response = restTemplate.postJson<Property>("/properties", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isNull()
            assertThat(property.expenses).isNotEmpty
            assertThat(property.rehabEstimates).isNull()
            assertThat(property.notes).isNull()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isNull()

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isNull()
        }
    }

    @Nested
    inner class UpdateProperty {
        @Test
        fun `update property with a market id populated`() {
            val properties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(properties).isNotEmpty
            val propertyToUpdate = properties.first()

            val markets = marketRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(markets).isNotEmpty
            val market = markets.first()

            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000,
                "marketId": "${market.id}"
            }
            """.trimIndent()

            val response = restTemplate.putJson<Property>("/properties/${propertyToUpdate.id}", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isEmpty()
            assertThat(property.expenses).isEmpty()
            assertThat(property.rehabEstimates).isEmpty()
            assertThat(property.notes).isEmpty()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isEqualTo(market.id)

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isEqualTo(market.id)
        }

        @Test
        fun `update property with a blank market id`() {
            val properties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(properties).isNotEmpty
            val propertyToUpdate = properties.first()

            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000,
                "marketId": ""
            }
            """.trimIndent()

            val response = restTemplate.putJson<Property>("/properties/${propertyToUpdate.id}", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isEmpty()
            assertThat(property.expenses).isEmpty()
            assertThat(property.rehabEstimates).isEmpty()
            assertThat(property.notes).isEmpty()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isNull()

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isNull()
        }

        @Test
        fun `update property with no market id in request`() {
            val properties = propertyRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(properties).isNotEmpty
            val propertyToUpdate = properties.first()

            val requestBody = """
            {                
                "address":"1234 test",
                "city":"test",
                "state":"mo",
                "zipCode":"63128",
                "listingUrl":"",
                "units":1,
                "watchlist":false,
                "archived":false,
                "offers":[],
                "expenses":[],
                "rehabEstimates":[],
                "notes":[],
                "metrics":[],
                "monthlyRent":1000,
                "arv":100000
            }
            """.trimIndent()

            val response = restTemplate.putJson<Property>("/properties/${propertyToUpdate.id}", requestBody, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            val property = response.body!!
            assertThat(property.id).isNotBlank
            assertThat(property.address).isEqualTo("1234 test")
            assertThat(property.city).isEqualTo("test")
            assertThat(property.state).isEqualTo("mo")
            assertThat(property.zipCode).isEqualTo("63128")
            assertThat(property.listingUrl).isEqualTo("")
            assertThat(property.units).isEqualTo(1)
            assertThat(property.watchlist).isFalse
            assertThat(property.archived).isFalse
            assertThat(property.offers).isEmpty()
            assertThat(property.expenses).isEmpty()
            assertThat(property.rehabEstimates).isEmpty()
            assertThat(property.notes).isEmpty()
            assertThat(property.metrics).isNotEmpty
            assertThat(property.monthlyRent).isEqualTo(BigDecimal.valueOf(1000))
            assertThat(property.arv).isEqualTo(BigDecimal.valueOf(100000))
            assertThat(property.marketId).isNull()

            val propertyFromDatabase = propertyRepository.findById(property.id!!)
            assertThat(propertyFromDatabase.isPresent).isTrue
            assertThat(propertyFromDatabase.get().marketId).isNull()
        }
    }
}
