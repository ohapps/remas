package com.ohapps.remasapi.mapper

import com.ohapps.remasapi.entity.UserEntity
import com.ohapps.remasapi.model.User
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class DozerMapperTest {

    @Autowired
    private lateinit var dozerMapper: DozerMapper

    @Test
    fun `convert test converting UserEntity to User object`() {
        val userEntity = UserEntity("1234", "test", listOf())

        val user = dozerMapper.convert(userEntity, User::class.java)

        Assertions.assertThat(user).isNotNull
        Assertions.assertThat(user.id).isEqualTo("1234")
        Assertions.assertThat(user.username).isEqualTo("test")
    }
}
