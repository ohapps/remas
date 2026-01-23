package com.ohapps.remasapi.service

import com.ohapps.remasapi.entity.MarketEntity
import com.ohapps.remasapi.entity.UserEntity
import com.ohapps.remasapi.enum.LocationType
import com.ohapps.remasapi.mapper.DozerMapper
import com.ohapps.remasapi.model.Market
import com.ohapps.remasapi.repository.MarketRentRepository
import com.ohapps.remasapi.repository.MarketRepository
import com.ohapps.remasapi.repository.PropertyRepository
import io.mockk.every
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import io.mockk.slot
import io.mockk.verify
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith

@ExtendWith(MockKExtension::class)
class MarketServiceTest {

    @MockK(relaxed = true)
    lateinit var marketRepository: MarketRepository

    @MockK(relaxed = true)
    lateinit var userService: UserService

    @MockK(relaxed = true)
    lateinit var marketQuestionService: MarketQuestionService

    @MockK(relaxed = true)
    lateinit var marketRentRepository: MarketRentRepository

    @MockK(relaxed = true)
    lateinit var propertyRepository: PropertyRepository

    val dozerMapper = DozerMapper()

    @InjectMockKs
    lateinit var marketService: MarketService

    @Test
    fun `create user market`() {
        val newMarket = Market("", "new market", LocationType.CITY_STATE, "test", listOf(), listOf(), null)
        val userEntity = UserEntity("1", "test", listOf())
        val marketEntity = MarketEntity(userEntity, newMarket.description, newMarket.locationType, newMarket.location, mutableListOf(), mutableListOf(), null).apply { id = "1" }
        val marketEntitySlot = slot<MarketEntity>()

        every { userService.getCurrentUserEntity() } returns userEntity
        every { marketRepository.save(capture(marketEntitySlot)) } returns marketEntity

        val returnedMarket = marketService.createUserMarket(newMarket, null)

        assertThat(returnedMarket).isNotNull
        assertThat(returnedMarket.id).isEqualTo(marketEntity.id)
        assertThat(returnedMarket.description).isEqualTo(marketEntity.description)
        assertThat(returnedMarket.locationType).isEqualTo(marketEntity.locationType)
        assertThat(returnedMarket.location).isEqualTo(marketEntity.location)

        assertThat(marketEntitySlot.captured.id).isEqualTo("")
        assertThat(marketEntitySlot.captured.user).isEqualTo(userEntity)

        verify { marketRepository.save(any()) }
    }
}
