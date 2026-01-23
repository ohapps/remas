package com.ohapps.remasapi.controller

import com.ohapps.remasapi.exception.DataNotFound
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class RestControllerAdvice {

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(DataNotFound::class)
    fun handleDataNotFound(e: DataNotFound) = mapOf("message" to e.message)
}
