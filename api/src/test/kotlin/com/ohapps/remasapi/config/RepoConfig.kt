package com.ohapps.remasapi.config

import com.ohapps.remasapi.entity.*
import com.ohapps.remasapi.enum.ExpenseType
import com.ohapps.remasapi.enum.LocationType
import com.ohapps.remasapi.enum.TransactionType
import com.ohapps.remasapi.repository.*
import com.ohapps.remasapi.utils.TestUser
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.math.BigDecimal
import java.time.LocalDate
import java.util.*

@Component
class RepoConfig {

    @Autowired
    lateinit var userRepository: UserRepository

    @Autowired
    lateinit var defaultExpenseRepository: DefaultExpenseRepository

    @Autowired
    lateinit var ledgerCategoryRepository: LedgerCategoryRepository

    @Autowired
    lateinit var ledgerRepository: LedgerRepository

    @Autowired
    lateinit var propertyRepository: PropertyRepository

    @Autowired
    lateinit var marketRepository: MarketRepository

    fun clearRepos() {
        ledgerRepository.deleteAll()
        ledgerCategoryRepository.deleteAll()
        defaultExpenseRepository.deleteAll()
        propertyRepository.deleteAll()
        marketRepository.deleteAll()
        userRepository.deleteAll()
    }

    fun initRepo() {
        val testUser = UserEntity(id = TestUser.NORMAL.id, username = TestUser.NORMAL.email, emptyList())
        userRepository.save(testUser)

        val otherUser = UserEntity(id = TestUser.OTHER.id, username = TestUser.OTHER.email, emptyList())
        userRepository.save(otherUser)

        // default expenses
        val insuranceDefaultExpense = DefaultExpenseEntity(
            id = UUID.randomUUID().toString(),
            user = testUser,
            description = "insurance",
            amount = BigDecimal.valueOf(1000),
            expenseType = ExpenseType.YEARLY
        )
        defaultExpenseRepository.save(insuranceDefaultExpense)

        // ledger categories
        val ledgerCategories = listOf(
            LedgerCategoryEntity(category = "Fees", transactionType = TransactionType.INCOME),
            LedgerCategoryEntity(category = "Refunds", transactionType = TransactionType.INCOME),
            LedgerCategoryEntity(category = "Rent", transactionType = TransactionType.INCOME),
            LedgerCategoryEntity(category = "Maintenance", transactionType = TransactionType.EXPENSE),
            LedgerCategoryEntity(category = "Mortgage Interest", transactionType = TransactionType.EXPENSE),
            LedgerCategoryEntity(category = "Repairs", transactionType = TransactionType.EXPENSE),
            LedgerCategoryEntity(category = "Supplies", transactionType = TransactionType.EXPENSE)
        )
        ledgerCategoryRepository.saveAll(ledgerCategories)

        // ledger entries
        val ledgerEntries = listOf(
            LedgerEntity(
                user = testUser,
                transactionDate = LocalDate.now().minusDays(7),
                payorPayee = "Test Tenant",
                description = "rent",
                category = ledgerCategories[2],
                amount = BigDecimal.valueOf(1000),
                checkNo = null,
                property = null
            ),
            LedgerEntity(
                user = testUser,
                transactionDate = LocalDate.now().minusDays(5),
                payorPayee = "Mr. Fix-It",
                description = "fix toilet",
                category = ledgerCategories[5],
                amount = BigDecimal.valueOf(200),
                checkNo = null,
                property = null
            ),
            LedgerEntity(
                user = otherUser,
                transactionDate = LocalDate.now().minusDays(5),
                payorPayee = "Other User",
                description = "fix toilet",
                category = ledgerCategories[5],
                amount = BigDecimal.valueOf(200),
                checkNo = null,
                property = null
            )
        )
        ledgerRepository.saveAll(ledgerEntries)

        // property entries
        val propertyEntities = listOf(
            PropertyEntity(
                user = testUser,
                address = "123 main street",
                city = "test city",
                state = "ST",
                zipCode = "12345",
                units = 1,
                monthlyRent = BigDecimal.valueOf(1200),
                arv = BigDecimal.valueOf(100000),
                purchased = LocalDate.now().minusDays(10),
                inService = LocalDate.now(),
                watchlist = false,
                listingUrl = "test.com",
                archived = false,
                offers = mutableListOf(),
                expenses = mutableListOf(),
                rehabEstimates = mutableListOf(),
                notes = mutableListOf()
            ),
            PropertyEntity(
                user = otherUser,
                address = "123 other street",
                city = "test city",
                state = "ST",
                zipCode = "12345",
                units = 1,
                monthlyRent = BigDecimal.valueOf(1200),
                arv = BigDecimal.valueOf(100000),
                purchased = LocalDate.now().minusDays(10),
                inService = LocalDate.now(),
                watchlist = false,
                listingUrl = "test.com",
                archived = false,
                offers = mutableListOf(),
                expenses = mutableListOf(),
                rehabEstimates = mutableListOf(),
                notes = mutableListOf()
            )
        )
        propertyRepository.saveAll(propertyEntities)

        // markets
        val markets = listOf(
            MarketEntity(
                user = testUser,
                description = "test market",
                locationType = LocationType.CITY_STATE,
                location = "1234 main street",
                metrics = mutableListOf(),
                rents = mutableListOf(),
                parentMarket = null
            )
        )

        marketRepository.saveAll(markets)

        // sub markets
        val subMarkets = listOf(
            MarketEntity(
                user = testUser,
                description = "test sub market",
                locationType = LocationType.CITY_STATE,
                location = "1234 second street",
                metrics = mutableListOf(),
                rents = mutableListOf(),
                parentMarket = markets.first()
            )
        )

        marketRepository.saveAll(subMarkets)
    }

    fun resetDatabase() {
        clearRepos()
        initRepo()
    }
}
