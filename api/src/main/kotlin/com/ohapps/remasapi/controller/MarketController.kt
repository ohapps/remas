package com.ohapps.remasapi.controller

import com.ohapps.remasapi.model.Market
import com.ohapps.remasapi.model.MarketRent
import com.ohapps.remasapi.model.MetricValue
import com.ohapps.remasapi.service.MarketService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/markets")
class MarketController(val marketService: MarketService) {

    @GetMapping
    fun getMarkets() = ResponseEntity.ok(marketService.getUserMarkets())

    @GetMapping("/recent")
    fun getRecentMarkets() = ResponseEntity.ok(marketService.getUserRecentMarkets())

    @PostMapping
    fun createMarket(@RequestBody market: Market, @RequestParam(required = false) parentId: String?) =
        ResponseEntity.ok(marketService.createUserMarket(market, parentId))

    @PutMapping("/{id}")
    fun updateMarket(@PathVariable id: String, @RequestBody market: Market) =
        ResponseEntity.ok(marketService.updateUserMarket(id, market))

    @DeleteMapping("/{id}")
    fun deleteMarket(@PathVariable id: String): ResponseEntity<Unit> {
        marketService.deleteUserMarket(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}/question/{questionId}/value")
    fun updateMetricValue(@PathVariable id: String, @PathVariable questionId: String, @RequestBody metricValue: MetricValue) =
        ResponseEntity.ok(marketService.updateMetricValue(id, questionId, metricValue.value))

    @PostMapping("/{id}/rent")
    fun createMarketRent(@PathVariable id: String, @RequestBody marketRent: MarketRent) =
        ResponseEntity.ok(marketService.createMarketRent(id, marketRent))

    @PutMapping("/{id}/rent/{rentId}")
    fun updateMarketRent(@PathVariable id: String, @PathVariable rentId: String, @RequestBody marketRent: MarketRent) =
        ResponseEntity.ok(marketService.updateMarketRent(id, rentId, marketRent))

    @DeleteMapping("/{id}/rent/{rentId}")
    fun deleteMarketRent(@PathVariable id: String, @PathVariable rentId: String): ResponseEntity<Unit> {
        marketService.deleteMarketRent(id, rentId)
        return ResponseEntity.noContent().build()
    }
}
