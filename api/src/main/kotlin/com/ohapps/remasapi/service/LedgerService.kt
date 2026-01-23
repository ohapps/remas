package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.LedgerCategoryEntity
import com.ohapps.remasapi.entity.LedgerEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.Ledger
import com.ohapps.remasapi.model.LedgerCategory
import com.ohapps.remasapi.repository.LedgerCategoryRepository
import com.ohapps.remasapi.repository.LedgerRepository
import org.springframework.data.domain.Sort
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class LedgerService(
    val userService: UserService,
    val ledgerRepository: LedgerRepository,
    val ledgerCategoryRepository: LedgerCategoryRepository,
    val propertyService: PropertyService,
    val dozerMapper: DozerMapper
) {

    fun getCategories(): List<LedgerCategory> {
        val sort = Sort.by(Sort.Direction.DESC, "transactionType").and(Sort.by(Sort.Direction.ASC, "category"))
        val categories = ledgerCategoryRepository.findAll(sort)
        return dozerMapper.convertAsList(categories, LedgerCategory::class.java)
    }

    fun getUserEntries(): List<Ledger> {
        val ledgerEntities = ledgerRepository.findAllByUserId(userService.getCurrentUser().id, Sort.by(Sort.Direction.DESC, "transactionDate"))
        return ledgerEntities.map { convertLedgerEntityToLedger(it) }
    }

    fun createEntry(ledger: Ledger): Ledger {
        val ledgerEntity = dozerMapper.convert(ledger, LedgerEntity::class.java)
        ledgerEntity.apply {
            user = userService.getCurrentUserEntity()
            category = findCategoryById(ledger.categoryId)
            property = ledger.propertyId?.let { propertyService.getUserProperty(it) }
        }
        ledgerRepository.save(ledgerEntity)
        return convertLedgerEntityToLedger(ledgerEntity)
    }

    fun updateEntry(id: String, ledger: Ledger): Ledger {
        val ledgerEntity = getEntryEntity(id)
        ledgerEntity.apply {
            transactionDate = ledger.transactionDate
            payorPayee = ledger.payorPayee
            description = ledger.description
            category = findCategoryById(ledger.categoryId)
            amount = ledger.amount
            checkNo = ledger.checkNo
            property = ledger.propertyId?.let { propertyService.getUserProperty(it) }
        }
        ledgerRepository.save(ledgerEntity)
        return convertLedgerEntityToLedger(ledgerEntity)
    }

    fun deleteEntry(id: String) {
        val ledgerEntity = getEntryEntity(id)
        ledgerRepository.delete(ledgerEntity)
    }

    private fun getEntryEntity(id: String) = ledgerRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id)
        .orElseThrow { DataNotFound("entry not found in database") }

    private fun convertLedgerEntityToLedger(ledgerEntity: LedgerEntity): Ledger {
        val ledger = dozerMapper.convert(ledgerEntity, Ledger::class.java)
        ledger.apply {
            propertyId = ledgerEntity.property?.id
            propertyDescription = ledgerEntity.property?.address
            categoryId = ledgerEntity.category.id.toString()
            categoryDescription = "${ledgerEntity.category.transactionType.toString().toLowerCase().capitalize()} - ${ledgerEntity.category.category}"
            transactionType = ledgerEntity.category.transactionType.toString()
        }
        return ledger
    }

    private fun findCategoryById(categoryId: String): LedgerCategoryEntity {
        return ledgerCategoryRepository.findByIdOrNull(categoryId) ?: throw DataNotFound("invalid ledger category id $categoryId")
    }
}
