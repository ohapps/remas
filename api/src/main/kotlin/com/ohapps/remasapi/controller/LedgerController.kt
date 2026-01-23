package com.ohapps.remasapi.controller

import com.ohapps.remasapi.model.Ledger
import com.ohapps.remasapi.service.LedgerService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/ledger")
class LedgerController(val ledgerService: LedgerService) {

    @GetMapping("/categories")
    fun getCategories() = ResponseEntity.ok(ledgerService.getCategories())

    @GetMapping
    fun getEntries() = ResponseEntity.ok(ledgerService.getUserEntries())

    @PostMapping
    fun createEntry(@RequestBody ledger: Ledger) = ResponseEntity.ok(ledgerService.createEntry(ledger))

    @PutMapping("/{id}")
    fun updateEntry(@PathVariable id: String, @RequestBody ledger: Ledger) = ResponseEntity.ok(ledgerService.updateEntry(id, ledger))

    @DeleteMapping("/{id}")
    fun deleteEntry(@PathVariable id: String): ResponseEntity<Unit> {
        ledgerService.deleteEntry(id)
        return ResponseEntity.noContent().build()
    }
}
