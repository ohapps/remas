package com.ohapps.remasapi.controller

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.json.Views
import com.ohapps.remasapi.model.*
import com.ohapps.remasapi.service.PropertyService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/properties")
class PropertyController(val propertyService: PropertyService) {

    @JsonView(Views.Read::class)
    @GetMapping
    fun getProperties() = ResponseEntity.ok(propertyService.getUserProperties())

    @JsonView(Views.Read::class)
    @GetMapping("/recent")
    fun getRecentProperties() = ResponseEntity.ok(propertyService.getUserRecentProperties())

    @JsonView(Views.Read::class)
    @PostMapping
    fun createProperty(
        @RequestBody @JsonView(Views.Write::class)
        property: Property
    ) = ResponseEntity.ok(propertyService.createProperty(property))

    @JsonView(Views.Read::class)
    @PutMapping("/{id}")
    fun updateProperty(
        @PathVariable id: String,
        @RequestBody
        @JsonView(Views.Write::class)
        property: Property
    ) = ResponseEntity.ok(propertyService.updateProperty(id, property))

    @PutMapping("/{id}/archive")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun archiveProperty(@PathVariable id: String) = propertyService.setArchiveStatus(id, true)

    @PutMapping("/{id}/unarchive")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun unarchiveProperty(@PathVariable id: String) = propertyService.setArchiveStatus(id, false)

    @DeleteMapping("/{id}")
    fun deleteProperty(@PathVariable id: String): ResponseEntity<Unit> {
        propertyService.deleteProperty(id)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/{id}/offers")
    fun createOffer(@PathVariable id: String, @RequestBody offer: Offer) = ResponseEntity.ok(propertyService.createOffer(id, offer))

    @PutMapping("/{id}/offers/{offerId}")
    fun updateOffer(@PathVariable id: String, @PathVariable offerId: String, @RequestBody offer: Offer) = ResponseEntity.ok(propertyService.updateOffer(id, offerId, offer))

    @PutMapping("/{id}/offers/{offerId}/active")
    fun makeOfferActive(@PathVariable id: String, @PathVariable offerId: String) = ResponseEntity.ok(propertyService.makeOfferActive(id, offerId))

    @DeleteMapping("/{id}/offers/{offerId}")
    fun deleteOffer(@PathVariable id: String, @PathVariable offerId: String) = ResponseEntity.ok(propertyService.deleteOffer(id, offerId))

    @PostMapping("/{id}/expenses")
    fun createExpense(@PathVariable id: String, @RequestBody expense: Expense) = ResponseEntity.ok(propertyService.createExpense(id, expense))

    @PutMapping("/{id}/expenses/{expenseId}")
    fun updateExpense(@PathVariable id: String, @PathVariable expenseId: String, @RequestBody expense: Expense) = ResponseEntity.ok(propertyService.updateExpense(id, expenseId, expense))

    @DeleteMapping("/{id}/expenses/{expenseId}")
    fun deleteExpense(@PathVariable id: String, @PathVariable expenseId: String) = ResponseEntity.ok(propertyService.deleteExpense(id, expenseId))

    @PostMapping("/{id}/rehab-estimates")
    fun createRehabEstimate(@PathVariable id: String, @RequestBody rehabEstimate: RehabEstimate) = ResponseEntity.ok(propertyService.createRehabEstimate(id, rehabEstimate))

    @PutMapping("/{id}/rehab-estimates/{estimateId}")
    fun updateRehabEstimate(@PathVariable id: String, @PathVariable estimateId: String, @RequestBody rehabEstimate: RehabEstimate) = ResponseEntity.ok(propertyService.updateRehabEstimate(id, estimateId, rehabEstimate))

    @DeleteMapping("/{id}/rehab-estimates/{estimateId}")
    fun deleteRehabEstimate(@PathVariable id: String, @PathVariable estimateId: String) = ResponseEntity.ok(propertyService.deleteRehabEstimate(id, estimateId))

    @PostMapping("/{id}/notes")
    fun createNote(@PathVariable id: String, @RequestBody propertyNote: PropertyNote) = ResponseEntity.ok(propertyService.createPropertyNote(id, propertyNote))

    @PutMapping("/{id}/notes/{noteId}")
    fun updateNote(@PathVariable id: String, @PathVariable noteId: String, @RequestBody propertyNote: PropertyNote) = ResponseEntity.ok(propertyService.updatePropertyNote(id, noteId, propertyNote))

    @DeleteMapping("/{id}/notes/{noteId}")
    fun deleteNote(@PathVariable id: String, @PathVariable noteId: String) = ResponseEntity.ok(propertyService.deletePropertyNote(id, noteId))
}
