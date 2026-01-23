package com.ohapps.remasapi

import com.ohapps.remasapi.utils.logger
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class RemasApiApplication : CommandLineRunner {

    @Value("\${app.config}")
    private val config: String? = null

    override fun run(vararg args: String?) {
        logger().info("app.config = {}", config)
    }
}

fun main(args: Array<String>) {
    runApplication<RemasApiApplication>(*args)
}
