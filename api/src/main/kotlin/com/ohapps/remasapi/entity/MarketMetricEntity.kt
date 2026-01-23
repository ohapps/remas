package com.ohapps.remasapi.entity

import org.hibernate.annotations.GenericGenerator
import javax.persistence.*

@Entity
@Table(name = "market_metric")
data class MarketMetricEntity(
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    var id: String?,

    @ManyToOne
    @JoinColumn(name = "market_id")
    var market: MarketEntity,

    @ManyToOne
    @JoinColumn(name = "question_id")
    var question: MarketQuestionEntity,

    @Column(name = "metric_value", nullable = false)
    var metricValue: String
)
