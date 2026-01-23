package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.MarketQuestionEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.MarketQuestion
import com.ohapps.remasapi.repository.MarketQuestionRepository
import org.springframework.stereotype.Service

@Service
class MarketQuestionService(val marketQuestionRepository: MarketQuestionRepository, val userService: UserService, val dozerMapper: DozerMapper) {

    fun getUserMarketQuestions() = dozerMapper.convertAsList(marketQuestionRepository.findAllByUserId(userService.getCurrentUser().id), MarketQuestion::class.java)
    fun getUserMarketQuestion(id: String): MarketQuestionEntity = marketQuestionRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id).orElseThrow { DataNotFound("question not found in database") }

    fun createMarketQuestion(marketQuestion: MarketQuestion) {
        val marketQuestionEntity = dozerMapper.convert(marketQuestion, MarketQuestionEntity::class.java)
        marketQuestionEntity.user = userService.getCurrentUserEntity()
        marketQuestionRepository.save(marketQuestionEntity)
    }

    fun updateMarketQuestion(id: String, marketQuestion: MarketQuestion) {
        val marketQuestionEntity = getUserMarketQuestion(id)
        marketQuestionEntity.apply {
            question = marketQuestion.question
            answerType = marketQuestion.answerType
        }
        marketQuestionRepository.save(marketQuestionEntity)
    }

    fun deleteMarketQuestion(id: String) {
        val marketQuestionEntity = getUserMarketQuestion(id)
        marketQuestionRepository.delete(marketQuestionEntity)
    }
}
