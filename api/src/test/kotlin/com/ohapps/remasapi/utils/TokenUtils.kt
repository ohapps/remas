package com.ohapps.remasapi.utils

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jws
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Component
import org.springframework.util.ResourceUtils
import java.nio.file.Files
import java.security.KeyFactory
import java.security.PrivateKey
import java.security.PublicKey
import java.security.spec.PKCS8EncodedKeySpec
import java.security.spec.X509EncodedKeySpec
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Component
class TokenUtils {

    fun generateToken(testUser: TestUser): String {
        val privateKey: PrivateKey = getPrivateKey()
        val now = Instant.now()
        return Jwts.builder()
            .claim("https://ohapps.com/email", testUser.email)
            .setSubject(testUser.id)
            .setId(UUID.randomUUID().toString())
            .setIssuedAt(Date.from(now))
            .setExpiration(Date.from(now.plus(20L, ChronoUnit.MINUTES)))
            .signWith(privateKey)
            .compact()
    }

    fun parseJwt(jwtString: String): Jws<Claims> {
        val publicKey = getPublicKey()
        return Jwts.parserBuilder()
            .setSigningKey(publicKey)
            .build()
            .parseClaimsJws(jwtString)
    }

    fun getPrivateKey(): PrivateKey {
        val file = ResourceUtils.getFile("classpath:private.pem")
        val rsaPrivateKey = String(Files.readAllBytes(file.toPath())).replace("\n", "")
        val keySpec = PKCS8EncodedKeySpec(Base64.getDecoder().decode(rsaPrivateKey))
        val kf: KeyFactory = KeyFactory.getInstance("RSA")
        return kf.generatePrivate(keySpec)
    }

    fun getPublicKey(): PublicKey {
        val file = ResourceUtils.getFile("classpath:public.pem")
        val rsaPublicKey = String(Files.readAllBytes(file.toPath())).replace("\n", "")
        val keySpec = X509EncodedKeySpec(Base64.getDecoder().decode(rsaPublicKey))
        val kf = KeyFactory.getInstance("RSA")
        return kf.generatePublic(keySpec)
    }
}
