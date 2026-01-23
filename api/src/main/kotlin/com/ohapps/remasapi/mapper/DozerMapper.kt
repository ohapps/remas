package com.ohapps.remasapi.mapper

import com.github.dozermapper.core.DozerBeanMapperBuilder
import com.github.dozermapper.core.Mapper
import org.springframework.stereotype.Component

@Component
class DozerMapper {
    val mapper: Mapper

    fun<T, S> convert(fromBean: S, toBeanClass: Class<T>): T {
        return mapper.map(fromBean, toBeanClass)
    }

    fun<T> convertAsList(sources: Iterable<*>, toBeanClass: Class<T>): List<T> {
        val targets: MutableList<T> = ArrayList()
        for (source in sources) {
            targets.add(convert(source, toBeanClass))
        }
        return targets
    }

    init {
        mapper = DozerBeanMapperBuilder.buildDefault()
    }
}
