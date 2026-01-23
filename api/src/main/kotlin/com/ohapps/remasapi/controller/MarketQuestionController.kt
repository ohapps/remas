package com.ohapps.remasapi.controller

import com.ohapps.remasapi.model.MarketQuestion
import com.ohapps.remasapi.service.MarketQuestionService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/market-questions")
class MarketQuestionController(val marketQuestionService: MarketQuestionService) {

    @GetMapping
    fun getMarketQuestions() = marketQuestionService.getUserMarketQuestions()

    @PostMapping
    fun createMarketQuestion(@RequestBody marketQuestion: MarketQuestion): List<MarketQuestion> {
        marketQuestionService.createMarketQuestion(marketQuestion)
        return marketQuestionService.getUserMarketQuestions()
    }

    @PutMapping("/{id}")
    fun updateMarketQuestion(@PathVariable id: String, @RequestBody marketQuestion: MarketQuestion): List<MarketQuestion> {
        marketQuestionService.updateMarketQuestion(id, marketQuestion)
        return marketQuestionService.getUserMarketQuestions()
    }

    @DeleteMapping("/{id}")
    fun deleteMarketQuestion(@PathVariable id: String): List<MarketQuestion> {
        marketQuestionService.deleteMarketQuestion(id)
        return marketQuestionService.getUserMarketQuestions()
    }
}
