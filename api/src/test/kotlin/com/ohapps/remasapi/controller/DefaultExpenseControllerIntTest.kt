package com.ohapps.remasapi.controller

import com.ohapps.remasapi.BaseIntegrationTest
import com.ohapps.remasapi.enum.ExpenseType
import com.ohapps.remasapi.model.DefaultExpense
import com.ohapps.remasapi.repository.DefaultExpenseRepository
import com.ohapps.remasapi.utils.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import java.math.BigDecimal
import java.math.RoundingMode
import java.util.*

class DefaultExpenseControllerIntTest : BaseIntegrationTest() {

    @Autowired
    lateinit var defaultExpenseRepository: DefaultExpenseRepository

    @Nested
    inner class GetDefault {
        @Test
        fun `get default expenses`() {
            val response = restTemplate.getJson<List<DefaultExpense>>("/default-expenses", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(1)
            assertThat(response.body?.get(0)?.description).isEqualTo("insurance")
            assertThat(response.body?.get(0)?.amount).isEqualTo(BigDecimal.valueOf(1000.00).setScale(2, RoundingMode.HALF_UP))
            assertThat(response.body?.get(0)?.expenseType).isEqualTo(ExpenseType.YEARLY)
        }

        @Test
        fun `user without token should return access denied`() {
            val response = restTemplate.getJson<String>("/default-expenses")

            assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
            assertThat(response.body).isNull()
        }
    }

    @Nested
    inner class CreateDefaultExpense {
        @Test
        fun `create default expense`() {
            val existingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            val request = """
            {
                "description": "new default expense",
                "amount": 100,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.postJson<List<DefaultExpense>>("/default-expenses", request, normalUserToken)

            val updatedExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(2)
            assertThat(response.body?.get(1)?.description).isEqualTo("new default expense")
            assertThat(response.body?.get(1)?.amount).isEqualTo(BigDecimal.valueOf(100))
            assertThat(response.body?.get(1)?.expenseType).isEqualTo(ExpenseType.MONTHLY)
            assertThat(existingExpenses).hasSize(1)
            assertThat(updatedExpenses).hasSize(2)
        }

        @Test
        fun `invalid description length should return bad request`() {
            val request = """
            {
                "description": "really long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
                "amount": 100,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/default-expenses", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `user without token should return access denied`() {
            val request = """
            {
                "description": "description",
                "amount": 100,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.postJson<String>("/default-expenses", request)

            assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        }
    }

    @Nested
    inner class UpdateDefaultExpense {

        @Test
        fun `update default expense`() {
            val existingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(existingExpenses).hasSize(1)

            val expenseToUpdate = existingExpenses.first()

            val request = """
            {
                "description": "updated description",
                "amount": 200,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.putJson<List<DefaultExpense>>("/default-expenses/${expenseToUpdate.id}", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(1)
            assertThat(response.body?.get(0)?.id).isEqualTo(expenseToUpdate.id)
            assertThat(response.body?.get(0)?.description).isEqualTo("updated description")
            assertThat(response.body?.get(0)?.amount).isEqualTo(BigDecimal.valueOf(200))
            assertThat(response.body?.get(0)?.expenseType).isEqualTo(ExpenseType.MONTHLY)
        }

        @Test
        fun `invalid description length should return bad request`() {
            val existingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(existingExpenses).hasSize(1)

            val expenseToUpdate = existingExpenses.first()

            val request = """
            {
                "description": "really long descriptionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn",
                "amount": 100,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.putJson<String>("/default-expenses/${expenseToUpdate.id}", request, normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        }

        @Test
        fun `user without token should return access denied`() {
            val existingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(existingExpenses).hasSize(1)

            val expenseToUpdate = existingExpenses.first()

            val request = """
            {
                "description": "description",
                "amount": 100,
                "expenseType": "MONTHLY"
            }
            """.trimIndent()

            val response = restTemplate.putJson<String>("/default-expenses/${expenseToUpdate.id}", request)

            assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        }
    }

    @Nested
    inner class DeleteDefaultExpense {
        @Test
        fun `delete default expense`() {
            val existingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)

            assertThat(existingExpenses).hasSize(1)

            val expenseToDelete = existingExpenses.first()

            val response = restTemplate.deleteJson<List<DefaultExpense>>("/default-expenses/${expenseToDelete.id}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
            assertThat(response.body).hasSize(0)

            val remainingExpenses = defaultExpenseRepository.findAllByUserId(TestUser.NORMAL.id)
            assertThat(remainingExpenses).hasSize(0)
        }

        @Test
        fun `delete default expense that does not exists should return a data not found response`() {
            val response = restTemplate.deleteJson<String>("/default-expenses/${UUID.randomUUID()}", normalUserToken)

            assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        }

        @Test
        fun `user without token should return access denied`() {
            val response = restTemplate.deleteJson<String>("/default-expenses/${UUID.randomUUID()}")

            assertThat(response.statusCode).isEqualTo(HttpStatus.UNAUTHORIZED)
        }
    }
}
