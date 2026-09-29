package com.recruitx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class TalentPulseApplication {
    public static void main(String[] args) {
        SpringApplication.run(TalentPulseApplication.class, args);
    }
}
