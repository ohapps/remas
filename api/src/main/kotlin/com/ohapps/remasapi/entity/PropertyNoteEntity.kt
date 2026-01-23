package com.ohapps.remasapi.entity

import com.ohapps.remasapi.annotation.NoArgConstructor
import org.hibernate.annotations.GenericGenerator
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime
import javax.persistence.*

@NoArgConstructor
@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(name = "property_note")
data class PropertyNoteEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String,

    @ManyToOne
    @JoinColumn(name = "property_id")
    var property: PropertyEntity,

    @Column(name = "note")
    var note: String,

    @CreatedDate
    @Column(name = "created_date")
    var createdDate: LocalDateTime? = null,

    @LastModifiedDate
    @Column(name = "updated_date")
    var updatedDate: LocalDateTime? = null
)
