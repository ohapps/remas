package com.ohapps.remasapi.model

import com.fasterxml.jackson.annotation.JsonView
import com.ohapps.remasapi.annotation.NoArgConstructor
import com.ohapps.remasapi.json.Views
import java.time.LocalDateTime

@NoArgConstructor
data class PropertyNote(
    @JsonView(Views.Read::class)
    var id: String?,
    @JsonView(Views.Base::class)
    var note: String,
    @JsonView(Views.Base::class)
    var createdDate: LocalDateTime?,
    @JsonView(Views.Base::class)
    var updatedDate: LocalDateTime?
)
