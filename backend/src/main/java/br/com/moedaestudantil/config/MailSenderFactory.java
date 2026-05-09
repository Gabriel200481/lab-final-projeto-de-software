package br.com.moedaestudantil.config;

import io.micronaut.context.annotation.Factory;
import io.micronaut.context.annotation.Value;
import jakarta.inject.Singleton;
import java.util.Properties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Factory
public class MailSenderFactory {

    @Singleton
    public JavaMailSender javaMailSender(
            @Value("${javamail.host}") String host,
            @Value("${javamail.port}") int port,
            @Value("${javamail.username}") String username,
            @Value("${javamail.password}") String password,
            @Value("${javamail.properties.mail.smtp.auth:true}") boolean smtpAuth,
            @Value("${javamail.properties.mail.smtp.starttls.enable:true}") boolean startTls
    ) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(host);
        mailSender.setPort(port);
        mailSender.setUsername(username);
        mailSender.setPassword(password);

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.smtp.auth", String.valueOf(smtpAuth));
        props.put("mail.smtp.starttls.enable", String.valueOf(startTls));

        return mailSender;
    }
}
