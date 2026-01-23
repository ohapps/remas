package com.ohapps.remasapi

import com.ohapps.remasapi.config.RepoConfig
import com.ohapps.remasapi.utils.TestUser
import com.ohapps.remasapi.utils.TokenUtils
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.testcontainers.junit.jupiter.Testcontainers

@ExtendWith(SpringExtension::class)
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Testcontainers
class BaseIntegrationTest {

    @Autowired
    lateinit var restTemplate: TestRestTemplate

    @Autowired
    lateinit var repoConfig: RepoConfig

    @Autowired
    lateinit var tokenUtils: TokenUtils

    var normalUserToken: String = ""
    var otherUserToken: String = ""

    @BeforeAll
    fun beforeAll() {
        normalUserToken = tokenUtils.generateToken(TestUser.NORMAL)
        otherUserToken = tokenUtils.generateToken(TestUser.OTHER)
    }

    @BeforeEach
    fun beforeEach() {
        repoConfig.resetDatabase()
    }
}
