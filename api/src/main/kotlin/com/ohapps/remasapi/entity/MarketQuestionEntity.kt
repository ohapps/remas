package com.ohapps.remasapi.entity

import com.ohapps.remasapi.enum.MarketAnswerType
import org.hibernate.annotations.GenericGenerator
import javax.persistence.*

@Entity
@Table(name = "market_question")
data class MarketQuestionEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String,

    @ManyToOne
    @JoinColumn(name = "user_id")
    var user: UserEntity,

    @Column(nullable = false)
    var question: String,

    @Enumerated(EnumType.STRING)
    var answerType: MarketAnswerType
)
