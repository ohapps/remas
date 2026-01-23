package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.*
import com.ohapps.remasapi.enum.MetricUnit
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.*
import com.ohapps.remasapi.repository.DefaultExpenseRepository
import com.ohapps.remasapi.repository.PropertyRepository
import com.ohapps.remasapi.utils.logger
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.MathContext
import java.math.RoundingMode

@Service
class PropertyService(
    val userService: UserService,
    val marketService: MarketService,
    val propertyRepository: PropertyRepository,
    val defaultExpenseRepository: DefaultExpenseRepository,
    val dozerMapper: DozerMapper
) {

    fun getUserProperties() = dozerMapper.convertAsList(
        propertyRepository.findAllByUserId(userService.getCurrentUser().id),
        Property::class.java
    )
        .map {
            it.metrics = calculateMetrics(it)
            it
        }

    fun getUserRecentProperties() = dozerMapper.convertAsList(
        propertyRepository.findTop5ByUserIdAndUpdatedDateNotNullOrderByUpdatedDateDesc(userService.getCurrentUser().id),
        Property::class.java
    )
        .map {
            it.metrics = calculateMetrics(it)
            it
        }

    fun createProperty(property: Property): Property {
        logger().debug("creating property: $property")
        val propertyEntity = dozerMapper.convert(property, PropertyEntity::class.java)
        propertyEntity.user = userService.getCurrentUserEntity()
        propertyEntity.watchlist = false
        propertyEntity.archived = false
        propertyEntity.marketId =
            if (!property.marketId.isNullOrBlank()) marketService.getUserMarket(property.marketId!!).id else null
        propertyRepository.save(propertyEntity)
        propertyEntity.expenses = defaultExpenseRepository.findAllByUserId(userService.getCurrentUser().id).map {
            ExpenseEntity(
                id = "",
                property = propertyEntity,
                description = it.description,
                monthlyAmount = it.calculateMonthlyAmount(propertyEntity)
            )
        } as MutableList<ExpenseEntity>
        return saveAndConvertProperty(propertyEntity)
    }

    fun updateProperty(id: String, property: Property): Property {
        val propertyEntity = getUserProperty(id)
        propertyEntity.address = property.address
        propertyEntity.city = property.city
        propertyEntity.state = property.state
        propertyEntity.zipCode = property.zipCode
        propertyEntity.units = property.units
        propertyEntity.monthlyRent = property.monthlyRent
        propertyEntity.arv = property.arv
        propertyEntity.purchased = property.purchased
        propertyEntity.inService = property.inService
        propertyEntity.listingUrl = property.listingUrl
        propertyEntity.marketId =
            if (!property.marketId.isNullOrBlank()) marketService.getUserMarket(property.marketId!!).id else null
        return saveAndConvertProperty(propertyEntity)
    }

    fun setArchiveStatus(id: String, status: Boolean): Property {
        val propertyEntity = getUserProperty(id)
        propertyEntity.apply {
            archived = status
        }
        return saveAndConvertProperty(propertyEntity)
    }

    fun deleteProperty(id: String) {
        val propertyEntity = getUserProperty(id)
        propertyRepository.delete(propertyEntity)
    }

    fun getUserProperty(id: String): PropertyEntity =
        propertyRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id)
            .orElseThrow { DataNotFound("property not found in database") }

    fun createOffer(propertyId: String, offer: Offer): Property {
        val propertyEntity = getUserProperty(propertyId)
        val offerEntity = dozerMapper.convert(offer, OfferEntity::class.java)
        offerEntity.property = propertyEntity
        offerEntity.active = true
        propertyEntity.offers.forEach { it.active = false }
        propertyEntity.offers.add(offerEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    fun updateOffer(propertyId: String, offerId: String, offer: Offer): Property {
        val propertyEntity = getUserProperty(propertyId)
        val offerEntity = propertyEntity.offers.firstOrNull { it.id == offerId }
            ?: throw DataNotFound("invalid offer id $offerId")
        offerEntity.apply {
            description = offer.description
            purchasePrice = offer.purchasePrice
            cashDown = offer.cashDown
            loanAmount = offer.loanAmount
            loanYears = offer.loanYears
            loanRate = offer.loanRate
            mortgagePayment = offer.mortgagePayment
            principalPayDown = offer.principalPayDown
            closingCost = offer.closingCost
        }
        return saveAndConvertProperty(propertyEntity)
    }

    fun deleteOffer(propertyId: String, offerId: String): Property {
        val propertyEntity = getUserProperty(propertyId)
        val offerEntity = propertyEntity.offers.firstOrNull { it.id == offerId }
            ?: throw DataNotFound("invalid offer id $offerId")
        propertyEntity.offers.remove(offerEntity)
        propertyEntity.offers.stream().findFirst().ifPresent { it.active = true }
        return saveAndConvertProperty(propertyEntity)
    }

    fun makeOfferActive(propertyId: String, offerId: String): Property {
        val propertyEntity = getUserProperty(propertyId)
        propertyEntity.offers.map { it.active = it.id == offerId }
        return saveAndConvertProperty(propertyEntity)
    }

    fun createExpense(propertyId: String, expense: Expense): Property {
        val propertyEntity = getUserProperty(propertyId)
        val expenseEntity = dozerMapper.convert(expense, ExpenseEntity::class.java)
        expenseEntity.property = propertyEntity
        propertyEntity.expenses.add(expenseEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    fun updateExpense(propertyId: String, expenseId: String, expense: Expense): Property {
        val propertyEntity = getUserProperty(propertyId)
        val expenseEntity = propertyEntity.expenses.firstOrNull { it.id == expenseId }
            ?: throw DataNotFound("invalid expense id $expenseId")
        expenseEntity.apply {
            description = expense.description
            monthlyAmount = expense.monthlyAmount
        }
        return saveAndConvertProperty(propertyEntity)
    }

    fun deleteExpense(propertyId: String, expenseId: String): Property {
        val propertyEntity = getUserProperty(propertyId)
        val expenseEntity = propertyEntity.expenses.firstOrNull { it.id == expenseId }
            ?: throw DataNotFound("invalid expense id $expenseId")
        propertyEntity.expenses.remove(expenseEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    fun createRehabEstimate(propertyId: String, rehabEstimate: RehabEstimate): Property {
        val propertyEntity = getUserProperty(propertyId)
        val rehabEstimateEntity = dozerMapper.convert(rehabEstimate, RehabEstimateEntity::class.java)
        rehabEstimateEntity.property = propertyEntity
        propertyEntity.rehabEstimates.add(rehabEstimateEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    fun updateRehabEstimate(propertyId: String, estimateId: String, rehabEstimate: RehabEstimate): Property {
        val propertyEntity = getUserProperty(propertyId)
        val rehabEstimateEntity = propertyEntity.rehabEstimates.firstOrNull { it.id == estimateId }
            ?: throw DataNotFound("invalid rehab estimate id $estimateId")
        rehabEstimateEntity.apply {
            description = rehabEstimate.description
            estimate = rehabEstimate.estimate
        }
        return saveAndConvertProperty(propertyEntity)
    }

    fun deleteRehabEstimate(propertyId: String, estimateId: String): Property {
        val propertyEntity = getUserProperty(propertyId)
        val rehabEstimateEntity = propertyEntity.rehabEstimates.firstOrNull { it.id == estimateId }
            ?: throw DataNotFound("invalid rehab estimate id $estimateId")
        propertyEntity.rehabEstimates.remove(rehabEstimateEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    fun createPropertyNote(propertyId: String, propertyNote: PropertyNote): Property {
        val propertyEntity = getUserProperty(propertyId)
        val propertyNoteEntity = dozerMapper.convert(propertyNote, PropertyNoteEntity::class.java)
        propertyNoteEntity.property = propertyEntity
        propertyEntity.notes.add(propertyNoteEntity)
        return saveAndConvertProperty(propertyEntity, true)
    }

    fun updatePropertyNote(propertyId: String, noteId: String, propertyNote: PropertyNote): Property {
        val propertyEntity = getUserProperty(propertyId)
        val propertyNoteEntity = propertyEntity.notes.firstOrNull { it.id == noteId }
            ?: throw DataNotFound("invalid property note id $noteId")
        propertyNoteEntity.apply {
            note = propertyNote.note
        }
        return saveAndConvertProperty(propertyEntity, true)
    }

    fun deletePropertyNote(propertyId: String, noteId: String): Property {
        val propertyEntity = getUserProperty(propertyId)
        val propertyNoteEntity = propertyEntity.notes.firstOrNull { it.id == noteId }
            ?: throw DataNotFound("invalid property note id $noteId")
        propertyEntity.notes.remove(propertyNoteEntity)
        return saveAndConvertProperty(propertyEntity)
    }

    private fun saveAndConvertProperty(propertyEntity: PropertyEntity, reload: Boolean = false): Property {
        propertyRepository.save(propertyEntity)
        val updatedProperty = if (reload) propertyEntity.id?.let { getUserProperty(it) } else propertyEntity
        val property = dozerMapper.convert(updatedProperty, Property::class.java)
        property.metrics = calculateMetrics(property)
        return property
    }

    fun calculateMetrics(property: Property): List<PropertyMetric> {
        /*
        Metric
        - Initial Investment = active_offer.cash_down + active_offer.closing_cost + rehab_estimates.total
        - Monthly Cashflow = monthlyRent - expenses.total_monthly_amount
        - Yearly Cashflow = monthly * 12
        - Expected cashflow = initial investment / 100
        - ROI = (((monthlyRent + offer.principlePayDown) * 12) - expenses.total_monthly_amount) / initialInvestment
        - Cash on Cash = yearlyCashflow / initialInvestment
        - Net Operating Income = monthlyRent * 12 - monthlyOperatingExpenses * 12 - not adds as a metric
        - Cap Rate = net operating income / arv
        - Rent vs Property Value = monthlyRent / arv
        - Market Value Discount = ( arv - ( activeOffer.purchasePrice - rehabEstimates.total) ) / arv
        - Years to recover investment = initial investment / yearly cashflow
         */

        val activeOffer = property.offers?.firstOrNull { it.active == true }
        val rehabEstimateTotal =
            property.rehabEstimates?.map { it.estimate }?.fold(BigDecimal.ZERO) { acc, cur -> acc + cur }
                ?: BigDecimal.ZERO
        val monthlyExpenses =
            property.expenses?.map { it.monthlyAmount }?.fold(BigDecimal.ZERO) { acc, cur -> acc + cur }
                ?: BigDecimal.ZERO
        val monthlyCashflow = property.monthlyRent?.minus(monthlyExpenses) ?: BigDecimal.ZERO
        val yearlyCashflow = monthlyCashflow.multiply(BigDecimal.valueOf(12))
        val initialInvestment =
            if (activeOffer != null) activeOffer.cashDown + activeOffer.closingCost + rehabEstimateTotal else rehabEstimateTotal
        val expectedCashflow = initialInvestment.divide(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP)
        val yearlyReturn = if (activeOffer != null && property.monthlyRent != null) {
            (property.monthlyRent!!.add(activeOffer.principalPayDown)).minus(monthlyExpenses)
                .multiply(BigDecimal.valueOf(12))
        } else BigDecimal.ZERO
        val roi = if (yearlyReturn > BigDecimal.ZERO && initialInvestment > BigDecimal.ZERO) {
            yearlyReturn.divide(initialInvestment, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP)
        } else BigDecimal.ZERO
        val cashOnCash = if (initialInvestment > BigDecimal.ZERO) {
            yearlyCashflow.divide(initialInvestment, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP)
        } else BigDecimal.ZERO
        val capRate = if (property.arv != null && property.arv!! > BigDecimal.ZERO) {
            monthlyCashflow.multiply(BigDecimal.valueOf(12)).divide(property.arv, MathContext.DECIMAL128)
                .multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP)
        } else BigDecimal.ZERO
        val rentVsProperty =
            if (property.arv != null && property.arv!! > BigDecimal.ZERO && property.monthlyRent != null) {
                property.monthlyRent!!.divide(property.arv, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP)
            } else BigDecimal.ZERO
        val marketValueDiscount = if (property.arv != null && property.arv!! > BigDecimal.ZERO && activeOffer != null) {
            property.arv!!.subtract(activeOffer.purchasePrice.subtract(rehabEstimateTotal))
                .divide(property.arv, MathContext.DECIMAL128).multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP)
        } else BigDecimal.ZERO
        val yearsToRecover = if (initialInvestment > BigDecimal.ZERO && yearlyCashflow > BigDecimal.ZERO) {
            initialInvestment.divide(yearlyCashflow, MathContext.DECIMAL128).setScale(2, RoundingMode.HALF_UP)
        } else BigDecimal.ZERO

        val metrics = mutableListOf<PropertyMetric>()
        metrics.add(PropertyMetric("Initial Investment", initialInvestment, MetricUnit.DOLLAR_AMOUNT, ""))
        metrics.add(PropertyMetric("Monthly Cashflow", monthlyCashflow, MetricUnit.DOLLAR_AMOUNT, ""))
        metrics.add(PropertyMetric("Yearly Cashflow", yearlyCashflow, MetricUnit.DOLLAR_AMOUNT, ""))
        metrics.add(
            PropertyMetric(
                "Expected Monthly Cashflow",
                expectedCashflow,
                MetricUnit.DOLLAR_AMOUNT,
                "Expected monthly cashflow is equal to \$100 for every \$10,000 initially invested"
            )
        )
        metrics.add(
            PropertyMetric(
                "Return on Investment (ROI)",
                roi,
                MetricUnit.PERCENT,
                "ROI is the yearly income plus yearly principal pay down minus the yearly expenses divided by the initial investment. This return is useful for comparing to other types of investments like mutual funds and savings accounts."
            )
        )
        metrics.add(
            PropertyMetric(
                "Cash on Cash",
                cashOnCash,
                MetricUnit.PERCENT,
                "Cash on Cash is the yearly cashflow divided by the initial investment. This is similar to ROI except it excludes principal pay down and appreciation and is only concerned with the amount of cash initially required and how much you get back each year."
            )
        )
        metrics.add(
            PropertyMetric(
                "Cap Rate",
                capRate,
                MetricUnit.PERCENT,
                "Cap Rate is annual net operating income divided by market value. This is used to compare the return for a given property against other properties. It can also be used to trend over time to tell if a market is heating up (rate goes down) or cooling off (rate goes up)."
            )
        )
        metrics.add(
            PropertyMetric(
                "Rent vs Property Value",
                rentVsProperty,
                MetricUnit.PERCENT,
                "Rent vs Property Value is the monthly rent compared to the market value. This is sometimes referred to as the 1% rule which is considered the minimum acceptable value."
            )
        )
        metrics.add(
            PropertyMetric(
                "Market Value Discount",
                marketValueDiscount,
                MetricUnit.PERCENT,
                "Market Value Discount is the difference between the purchase price plus rehab cost and the market value."
            )
        )
        metrics.add(
            PropertyMetric(
                "Years To Recover Investment",
                yearsToRecover,
                MetricUnit.COUNT,
                "Years To Recover Investment is the initial investment divided by the yearly cashflow"
            )
        )
        return metrics
    }
}
