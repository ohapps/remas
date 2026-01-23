package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.TravelLogEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.TravelLog
import com.ohapps.remasapi.repository.TravelLogRepository
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
class TravelLogService(
    val userService: UserService,
    val travelLogRepository: TravelLogRepository,
    val dozerMapper: DozerMapper
) {
    fun getUserTravelLogs(): List<TravelLog> {
        val travelLogEntries = travelLogRepository.findAllByUserId(userService.getCurrentUser().id, Sort.by(Sort.Direction.DESC, "travelDate"))
        return dozerMapper.convertAsList(travelLogEntries, TravelLog::class.java)
    }

    fun createTravelLog(travelLog: TravelLog): TravelLog {
        val travelLogEntity = dozerMapper.convert(travelLog, TravelLogEntity::class.java)
        travelLogEntity.apply {
            user = userService.getCurrentUserEntity()
        }
        travelLogRepository.save(travelLogEntity)
        return dozerMapper.convert(travelLogEntity, TravelLog::class.java)
    }

    fun updateTravelLog(id: String, travelLog: TravelLog): TravelLog {
        val travelLogEntity = getTravelLogEntity(id)
        travelLogEntity.apply {
            travelDate = travelLog.travelDate
            description = travelLog.description
            miles = travelLog.miles
        }
        travelLogRepository.save(travelLogEntity)
        return dozerMapper.convert(travelLogEntity, TravelLog::class.java)
    }

    fun deleteTravelLog(id: String) {
        val travelLogEntity = getTravelLogEntity(id)
        travelLogRepository.delete(travelLogEntity)
    }

    private fun getTravelLogEntity(id: String) = travelLogRepository.findAllByIdAndUserId(id, userService.getCurrentUser().id).orElseThrow { DataNotFound("travel log not found in database") }
}
