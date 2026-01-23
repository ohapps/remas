package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.DefaultExpenseEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.DefaultExpense
import com.ohapps.remasapi.repository.DefaultExpenseRepository
import org.springframework.stereotype.Service

@Service
class DefaultExpensesService(
    val defaultExpenseRepository: DefaultExpenseRepository,
    val userService: UserService,
    val dozerMapper: DozerMapper
) {
    fun getDefaultExpenses() =
        dozerMapper.convertAsList(defaultExpenseRepository.findAllByUserId(userService.getCurrentUser().id), DefaultExpense::class.java)

    fun createDefaultExpense(defaultExpense: DefaultExpense): DefaultExpense {
        val defaultExpenseEntity = dozerMapper.convert(defaultExpense, DefaultExpenseEntity::class.java)
        defaultExpenseEntity.apply {
            user = userService.getCurrentUserEntity()
            description = defaultExpense.description
            amount = defaultExpense.amount
            expenseType = defaultExpense.expenseType
        }
        return saveAndConvert(defaultExpenseEntity)
    }

    fun updateDefaultExpense(defaultExpenseId: String, defaultExpense: DefaultExpense): DefaultExpense {
        val defaultExpenseEntity = getUserDefaultExpense(defaultExpenseId)
        defaultExpenseEntity.apply {
            description = defaultExpense.description
            amount = defaultExpense.amount
            expenseType = defaultExpense.expenseType
        }
        return saveAndConvert(defaultExpenseEntity)
    }

    fun deleteDefaultExpense(defaultExpenseId: String) {
        val defaultExpenseEntity = getUserDefaultExpense(defaultExpenseId)
        defaultExpenseRepository.delete(defaultExpenseEntity)
    }

    private fun saveAndConvert(defaultExpenseEntity: DefaultExpenseEntity): DefaultExpense {
        defaultExpenseRepository.save(defaultExpenseEntity)
        return dozerMapper.convert(defaultExpenseEntity, DefaultExpense::class.java)
    }

    private fun getUserDefaultExpense(id: String) = defaultExpenseRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id)
        .orElseThrow { DataNotFound("default expense not found in database") }
}
