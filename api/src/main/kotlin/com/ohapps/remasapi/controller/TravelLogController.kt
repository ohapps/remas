package com.ohapps.remasapi.controller

import com.ohapps.remasapi.model.TravelLog
import com.ohapps.remasapi.service.TravelLogService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/travel-log")
class TravelLogController(val travelLogService: TravelLogService) {

    @GetMapping
    fun getTravelLogs() = travelLogService.getUserTravelLogs()

    @PostMapping
    fun createTravelLog(@RequestBody travelLog: TravelLog) = ResponseEntity.ok(travelLogService.createTravelLog(travelLog))

    @PutMapping("/{id}")
    fun updateTravelLog(@PathVariable id: String, @RequestBody travelLog: TravelLog) =
        ResponseEntity.ok(travelLogService.updateTravelLog(id, travelLog))

    @DeleteMapping("/{id}")
    fun deleteTravelLog(@PathVariable id: String): ResponseEntity<Unit> {
        travelLogService.deleteTravelLog(id)
        return ResponseEntity.noContent().build()
    }
}
