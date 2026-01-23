package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonFormat
import com.ohapps.remasapi.annotation.NoArgConstructor
import java.time.LocalDate

@NoArgConstructor
data class TravelLog(
    var id: String?,
    @JsonFormat(pattern = "MM/dd/yyyy")
    var travelDate: LocalDate,
    var description: String,
    var miles: Double
)
