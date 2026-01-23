package com.ohapps.remasapi.controller

import com.ohapps.remasapi.BaseIntegrationTest
import com.ohapps.remasapi.enum.TransactionType
import com.ohapps.remasapi.model.Ledger
import com.ohapps.remasapi.model.LedgerCategory
import com.ohapps.remasapi.repository.LedgerCategoryRepository
import com.ohapps.remasapi.repository.LedgerRepository
import com.ohapps.remasapi.utils.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate
import java.util.*

class LedgerControllerIntTest : BaseIntegrationTest() {

    @Autowired
    lateinit var ledgerCategoryRepository: LedgerCategoryRepository

    @Autowired
    lateinit var ledgerRepository: LedgerRepository

    @Nested
    inner class GetCategories {
        @Test
        fun `get categories`() {
            val response = restTemplate.getJson<List<LedgerCategory>>("/ledger/categories", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(7)
        }
    }

    @Nested
    inner class GetEntries {
        @Test
        fun `get user entries`() {
            val response = restTemplate.getJson<List<Ledger>>("/ledger", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(2)
            assertThat(response.body?.get(0)?.description).isEqualTo("fix toilet")
            assertThat(response.body?.get(0)?.transactionType).isEqualTo(TransactionType.EXPENSE.toString())
            assertThat(response.body?.get(1)?.description).isEqualTo("rent")
            assertThat(response.body?.get(1)?.transactionType).isEqualTo(TransactionType.INCOME.toString())
        }

        @Test
        fun `get user entries without token should return access denied`() {
            val response = restTemplate.getJson<String>("/ledger")

            assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        }
    }

    @Nested
    inner class CreateEntry {
        @Test
        fun `create entry`() {
            val existingEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)

            val category = ledgerCategoryRepository.findAll().first()

            val request = """
            {
                "transactionDate": "01/01/2022",
                "payorPayee": "Joe Renter",
                "description": "rent",
                "categoryId": "${category.id}",
                "amount": 100.00,
                "checkNo": "123123"                
            }
            """.trimIndent()

            val response = restTemplate.postJson<Ledger>("/ledger", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body?.id).isNotNull
            assertThat(response.body?.transactionDate).isEqualTo(LocalDate.of(2022, 1, 1))
            assertThat(response.body?.payorPayee).isEqualTo("Joe Renter")
            assertThat(response.body?.description).isEqualTo("rent")
            assertThat(response.body?.categoryId).isEqualTo(category.id)
            assertThat(response.body?.amount).isEqualTo(BigDecimal.valueOf(100).setScale(2, RoundingMode.HALF_UP))
            assertThat(response.body?.checkNo).isEqualTo("123123")

            val updatedEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingEntries).hasSize(2)
            assertThat(updatedEntries).hasSize(3)
        }

        @Test
        fun `request with missing payor payee should return a bad request response`() {
            val request = """
            {
                "transactionDate": "01/01/2022",
                "payorPayee": "",
                "description": "rent",
                "categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
                "amount": 100.00,
                "checkNo": "123123"                
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/ledger", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `request with very long payor payee should return a bad request response`() {
            val request = """
            {
                "transactionDate": "01/01/2022",
                "payorPayee": "very long payee longgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
                "description": "rent",
                "categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
                "amount": 100.00,
                "checkNo": "123123"                
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/ledger", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `request with empty description should return a bad request response`() {
            val request = """
            {
                "transactionDate": "01/01/2022",
                "payorPayee": "payee",
                "description": "",
                "categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
                "amount": 100.00,
                "checkNo": "123123"                
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/ledger", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `request with very long description should return a bad request response`() {
            val request = """
            {
                "transactionDate": "01/01/2022",
                "payorPayee": "payee",
                "description": "very long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
                "categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
                "amount": 100.00,
                "checkNo": "123123"                
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/ledger", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }
    }

    @Nested
    inner class UpdateEntry {
        @Test
        fun `update entry with valid data should return successful response`() {
            val existingEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingEntries).hasSize(2)

            val entryToUpdate = existingEntries.first()

            val request = """
            {
            	"transactionDate": "03/18/2021",
            	"payorPayee": "${entryToUpdate.payorPayee}",
            	"description": "updated description",
            	"categoryId": "${entryToUpdate.category.id}",
            	"amount": ${entryToUpdate.amount},
            	"checkNo": "${entryToUpdate.checkNo}"
            }
            """.trimIndent()

            val response = restTemplate.putJson<Ledger>("/ledger/${entryToUpdate.id}", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body?.id).isEqualTo(entryToUpdate.id)
            assertThat(response.body?.description).isEqualTo("updated description")

            val updatedEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(updatedEntries).hasSize(2)
        }

        @Test
        fun `update entry with an id that doesn't exists should return a not found response`() {
            val request = """
            {
            	"transactionDate": "03/18/2021",
            	"payorPayee": "Joe Renter",
            	"description": "rent updated",
            	"categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
            	"amount": 100.00,
            	"checkNo": "123123",
            	"propertyId": "22e70a45-c271-4e3d-b39e-320ab0ac45d7"
            }
            """.trimIndent()

            val response = restTemplate.putJson<String>("/ledger/ebcf1f8a-ee30-41c1-8439-ad90e85e340a", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        }

        @Test
        fun `update entry with an invalid payor payee should return bad request response`() {
            val request = """
            {
            	"transactionDate": "03/18/2021",
            	"payorPayee": "very long payee longggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg",
            	"description": "rent updated",
            	"categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
            	"amount": 100.00,
            	"checkNo": "123123",
            	"propertyId": "22e70a45-c271-4e3d-b39e-320ab0ac45d7"
            }
            """.trimIndent()

            val response = restTemplate.putJson<String>("/ledger/ebcf1f8a-ee30-41c1-8439-ad90e85e340a", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `update entry with an invalid description should return bad request response`() {
            val request = """
            {
            	"transactionDate": "03/18/2021",
            	"payorPayee": "payee",
            	"description": "very long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
            	"categoryId": "a5ca793b-4a77-47a9-8e6f-e9a953082a2f",
            	"amount": 100.00,
            	"checkNo": "123123",
            	"propertyId": "22e70a45-c271-4e3d-b39e-320ab0ac45d7"
            }
            """.trimIndent()

            val response = restTemplate.putJson<String>("/ledger/ebcf1f8a-ee30-41c1-8439-ad90e85e340a", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }
    }

    @Nested
    inner class DeleteEntry {
        @Test
        fun `should successfully delete entry`() {
            val existingEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(existingEntries).hasSize(2)

            val entryToUpdate = existingEntries.first()

            val response = restTemplate.deleteJson<Unit>("/ledger/${entryToUpdate.id}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NO_CONTENT)

            val updatedEntries = ledgerRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(updatedEntries).hasSize(1)
        }

        @Test
        fun `deleting another user's entry should return not found`() {
            val existingEntries = ledgerRepository.findAllByUserId(TestUser.OTHER.id)
            assertThat(existingEntries).hasSize(1)

            val entryToUpdate = existingEntries.first()

            val response = restTemplate.deleteJson<Unit>("/ledger/${entryToUpdate.id}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)

            val updatedEntries = ledgerRepository.findAllByUserId(TestUser.OTHER.id)
            assertThat(updatedEntries).hasSize(1)
        }

        @Test
        fun `deleting an entry that does not exists should return a not found`() {
            val response = restTemplate.deleteJson<Unit>("/ledger/${UUID.randomUUID()}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        }
    }
}
