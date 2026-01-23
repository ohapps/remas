package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.MarketEntity
import com.ohapps.remasapi.entity.MarketMetricEntity
import com.ohapps.remasapi.entity.MarketRentEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.Market
import com.ohapps.remasapi.model.MarketRent
import com.ohapps.remasapi.repository.MarketRentRepository
import com.ohapps.remasapi.repository.MarketRepository
import com.ohapps.remasapi.repository.PropertyRepository
import com.ohapps.remasapi.utils.logger
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MarketService(
    val marketRepository: MarketRepository,
    val userService: UserService,
    val dozerMapper: DozerMapper,
    val marketQuestionService: MarketQuestionService,
    val marketRentRepository: MarketRentRepository,
    val propertyRepository: PropertyRepository
) {

    fun getUserMarkets() = dozerMapper.convertAsList(marketRepository.findAllByUserId(userService.getCurrentUser().id), Market::class.java)

    fun getUserRecentMarkets() = dozerMapper.convertAsList(marketRepository.findTop5ByUserIdAndUpdatedDateNotNullOrderByUpdatedDateDesc(userService.getCurrentUser().id), Market::class.java)

    fun createUserMarket(market: Market, parentId: String?): Market {
        val marketEntity = dozerMapper.convert(market, MarketEntity::class.java)
        marketEntity.user = userService.getCurrentUserEntity()
        parentId?.let {
            marketEntity.parentMarket = getUserMarket(it)
        }
        val savedMarket = marketRepository.save(marketEntity)
        logger().info("market created")
        return dozerMapper.convert(savedMarket, Market::class.java)
    }

    fun updateUserMarket(id: String, market: Market): Market {
        val marketEntity = getUserMarket(id)
        marketEntity.description = market.description
        marketEntity.locationType = market.locationType
        marketEntity.location = market.location
        marketRepository.save(marketEntity)
        return dozerMapper.convert(marketEntity, Market::class.java)
    }

    @Transactional
    fun deleteUserMarket(id: String) {
        val marketEntity = getUserMarket(id)
        val marketId = marketEntity.id ?: throw DataNotFound("invalid market id")
        propertyRepository.clearMarketId(marketId)
        marketRepository.clearParentMarket(marketId)
        marketRepository.delete(marketEntity)
    }

    fun updateMetricValue(id: String, questionId: String, value: String) {
        val marketEntity = getUserMarket(id)
        val marketMetric = marketEntity.metrics.firstOrNull { it.question.id == questionId }
            ?: createNewMetric(marketEntity, questionId)
        marketMetric.metricValue = value
        marketRepository.save(marketEntity)
    }

    fun getUserMarket(id: String): MarketEntity = marketRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id).orElseThrow { DataNotFound("market not found in database") }

    fun createMarketRent(id: String, marketRent: MarketRent): MarketRent {
        val marketEntity = getUserMarket(id)
        val marketRentEntity = dozerMapper.convert(marketRent, MarketRentEntity::class.java)
        marketRentEntity.market = marketEntity
        marketRentRepository.save(marketRentEntity)
        return dozerMapper.convert(marketRentEntity, MarketRent::class.java)
    }

    fun updateMarketRent(id: String, rentId: String, marketRent: MarketRent): MarketRent {
        val marketEntity = getUserMarket(id)
        val marketRentEntity = marketEntity.rents.firstOrNull { it.id == rentId }
            ?: throw DataNotFound("invalid market rent id")
        marketRentEntity.apply {
            unitType = marketRent.unitType
            bedrooms = marketRent.bedrooms
            bathrooms = marketRent.bathrooms
            squareFeet = marketRent.squareFeet
            rentLow = marketRent.rentLow
            rentHigh = marketRent.rentHigh
        }
        marketRentRepository.save(marketRentEntity)
        return dozerMapper.convert(marketRentEntity, MarketRent::class.java)
    }

    fun deleteMarketRent(id: String, rentId: String) {
        val marketEntity = getUserMarket(id)
        val marketRentEntity = marketEntity.rents.firstOrNull { it.id == rentId }
            ?: throw DataNotFound("invalid market rent id")
        marketEntity.rents.remove(marketRentEntity)
        marketRepository.save(marketEntity)
    }

    private fun createNewMetric(market: MarketEntity, questionId: String): MarketMetricEntity {
        val question = marketQuestionService.getUserMarketQuestion(questionId)
        val newMetric = MarketMetricEntity(null, market, question, "")
        market.metrics.add(newMetric)
        return newMetric
    }
}
