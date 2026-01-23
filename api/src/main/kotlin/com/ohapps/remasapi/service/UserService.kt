package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.UserEntity
import com.ohapps.remasapi.exception.DataNotFound
import com.ohapps.remasapi.exception.InvalidUserToken
import com.ohapps.remasapi.model.User
import com.ohapps.remasapi.repository.UserRepository
import com.ohapps.remasapi.utils.logger
import org.springframework.security.core.Authentication
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Service

@Service
class UserService(val userRepository: UserRepository) {

    fun getCurrentUser(): User {
        val auth: Authentication = SecurityContextHolder.getContext().authentication

        if (auth.name == null) {
            throw InvalidUserToken("token missing user id")
        }

        val jwt: Jwt = auth.principal as Jwt

        if (!jwt.claims.containsKey("https://ohapps.com/email")) {
            throw InvalidUserToken("token missing email claim")
        }

        val username: String = jwt.claims["https://ohapps.com/email"] as String
        return User(auth.name, username)
    }

    fun getCurrentUserEntity(): UserEntity = userRepository.findById(getCurrentUser().id).orElseThrow { DataNotFound("user not found in database") }

    fun getAndUpdateCurrentUser(): User {
        val user = getCurrentUser()
        createOrUpdateUser(user)
        return user
    }

    fun createOrUpdateUser(user: User) {
        val optionalUser = userRepository.findById(user.id)

        if (optionalUser.isPresent) {
            val userEntity = optionalUser.get()
            if (userEntity.username != user.username) {
                userEntity.username = user.username
                userRepository.save(userEntity)
            }
        } else {
            userRepository.save(UserEntity(user.id, user.username, listOf()))
            logger().info("new user created: ${user.username}")
        }
    }
}
