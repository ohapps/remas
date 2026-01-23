package com.ohapps.remasapi.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/app")
class AppController {

    @GetMapping("/status")
    fun getStatus() = mapOf("status" to "app is up")
}
