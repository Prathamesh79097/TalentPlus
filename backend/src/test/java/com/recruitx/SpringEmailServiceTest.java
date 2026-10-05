package com.recruitx;

import com.recruitx.service.EmailService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.Instant;

@SpringBootTest
public class SpringEmailServiceTest {

    @Autowired
    private EmailService emailService;

    @Test
    public void testEmailService() throws InterruptedException {
        System.out.println(">>> TRIGGERING ASYNC EMAIL SERVICE <<<");
        emailService.sendApplicationConfirmationEmail(
            "talentpulseteam@gmail.com",
            "Prathamesh Test",
            "Software Developer",
            Instant.now()
        );
        System.out.println(">>> WAITING FOR ASYNC THREAD TO FINISH SENDING (8s) <<<");
        Thread.sleep(8000);
        System.out.println(">>> FINISHED WAITING <<<");
    }
}
