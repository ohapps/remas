package com.ohapps.remasapi.utils

import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.*

inline fun <reified T> typeRef() = object : ParameterizedTypeReference<T>() {}

enum class TestUser(val id: String, val email: String) {
    NORMAL("auth0|62a00f2b0f10ec13433bd41c", "craig@ohapps.com"),
    OTHER("c1bcc272-c3b9-4c95-8ce2-14b08ad8d3e9", "other@ohapps.com")
}

inline fun <reified T> TestRestTemplate.getJson(
    url: String,
    token: String? = null
): ResponseEntity<T> {
    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON
    if (token != null) {
        headers["Authorization"] = "Bearer $token"
    }
    return this.exchange(url, HttpMethod.GET, HttpEntity(null, headers), typeRef<T>())
}

inline fun <reified T> TestRestTemplate.postJson(
    url: String,
    json: String,
    token: String? = null
): ResponseEntity<T> {
    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON
    if (token != null) {
        headers["Authorization"] = "Bearer $token"
    }
    return this.exchange(url, HttpMethod.POST, HttpEntity(json, headers), typeRef<T>())
}

inline fun <reified T> TestRestTemplate.putJson(
    url: String,
    json: String,
    token: String? = null
): ResponseEntity<T> {
    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON
    if (token != null) {
        headers["Authorization"] = "Bearer $token"
    }
    return this.exchange(url, HttpMethod.PUT, HttpEntity(json, headers), typeRef<T>())
}

inline fun <reified T> TestRestTemplate.deleteJson(
    url: String,
    token: String? = null
): ResponseEntity<T> {
    val headers = HttpHeaders()
    headers.contentType = MediaType.APPLICATION_JSON
    if (token != null) {
        headers["Authorization"] = "Bearer $token"
    }
    return this.exchange(url, HttpMethod.DELETE, HttpEntity(null, headers), typeRef<T>())
}
