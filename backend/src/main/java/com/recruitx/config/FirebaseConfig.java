package com.recruitx.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Slf4j
@Configuration
public class FirebaseConfig {

    @Value("${firebase.project-id:talentpulse-f1225}")
    private String projectId;

    @Value("${FIREBASE_SERVICE_ACCOUNT_JSON:#{null}}")
    private String serviceAccountJsonEnv;

    @PostConstruct
    public void initFirebase() {
        if (FirebaseApp.getApps().isEmpty()) {
            GoogleCredentials credentials = null;

            // 1. Try environment variable FIREBASE_SERVICE_ACCOUNT_JSON (for Render / Production)
            if (serviceAccountJsonEnv != null && !serviceAccountJsonEnv.trim().isEmpty()) {
                try {
                    InputStream stream = new ByteArrayInputStream(serviceAccountJsonEnv.getBytes(StandardCharsets.UTF_8));
                    credentials = GoogleCredentials.fromStream(stream);
                    log.info("Loaded Firebase credentials from FIREBASE_SERVICE_ACCOUNT_JSON environment variable");
                } catch (Exception e) {
                    log.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON env var", e);
                }
            }

            // 2. Try local classpath file firebase-service-account.json
            if (credentials == null) {
                try {
                    InputStream serviceAccount = new ClassPathResource("firebase-service-account.json").getInputStream();
                    credentials = GoogleCredentials.fromStream(serviceAccount);
                    log.info("Loaded Firebase credentials from classpath:firebase-service-account.json");
                } catch (Exception e) {
                    log.warn("classpath:firebase-service-account.json not found: {}", e.getMessage());
                }
            }

            // 3. Fallback to Application Default Credentials
            if (credentials == null) {
                try {
                    credentials = GoogleCredentials.getApplicationDefault();
                    log.info("Loaded Firebase credentials from Google Application Default Credentials");
                } catch (Exception e) {
                    log.warn("Google Application Default Credentials not available: {}", e.getMessage());
                }
            }

            // Initialize app safely
            try {
                FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder()
                        .setProjectId(projectId);
                if (credentials != null) {
                    optionsBuilder.setCredentials(credentials);
                }
                FirebaseApp.initializeApp(optionsBuilder.build());
                log.info("FirebaseApp initialized successfully for project: {}", projectId);
            } catch (Exception e) {
                log.error("Failed to initialize FirebaseApp", e);
            }
        }
    }
}
