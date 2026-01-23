package com.ohapps.remasapi.exception

import java.lang.RuntimeException

class InvalidUserToken(message: String) : RuntimeException(message)
class DataNotFound(message: String) : RuntimeException(message)
