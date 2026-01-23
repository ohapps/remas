package com.ohapps.remasapi.controller

import com.ohapps.remasapi.model.User
import com.ohapps.remasapi.service.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/user")
class UserController(val userService: UserService) {

    @GetMapping()
    fun getUser(): ResponseEntity<User> {
        return ResponseEntity.ok(userService.getAndUpdateCurrentUser())
    }
}
