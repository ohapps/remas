package com.ohapps.remasapi.controller

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.json.Views
import com.ohapps.remasapi.model.DefaultExpense
import com.ohapps.remasapi.service.DefaultExpensesService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/default-expenses")
class DefaultExpensesController(val defaultExpensesService: DefaultExpensesService) {

    @JsonView(Views.Read::class)
    @GetMapping
    fun getDefaultExpenses() = defaultExpensesService.getDefaultExpenses()

    @JsonView(Views.Read::class)
    @PostMapping
    fun createDefaultExpense(
        @RequestBody @JsonView(Views.Write::class)
        defaultExpense: DefaultExpense
    ): List<DefaultExpense> {
        defaultExpensesService.createDefaultExpense(defaultExpense)
        return getDefaultExpenses()
    }

    @JsonView(Views.Read::class)
    @PutMapping("/{id}")
    fun updateDefaultExpense(
        @PathVariable id: String,
        @RequestBody
        @JsonView(Views.Write::class)
        defaultExpense: DefaultExpense
    ): List<DefaultExpense> {
        defaultExpensesService.updateDefaultExpense(id, defaultExpense)
        return getDefaultExpenses()
    }

    @JsonView(Views.Read::class)
    @DeleteMapping("/{id}")
    fun deleteDefaultExpense(@PathVariable id: String): List<DefaultExpense> {
        defaultExpensesService.deleteDefaultExpense(id)
        return getDefaultExpenses()
    }
}
