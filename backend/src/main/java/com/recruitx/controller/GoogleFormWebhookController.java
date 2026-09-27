package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class GoogleFormWebhookController {

    private final FirestoreService db;

    @Value("${google.webhook.secret:talentpulse-secret-key}")
    private String expectedSecret;

    @PostMapping("/google-form")
    public ResponseEntity<Map<String, Object>> handleGoogleFormWebhook(
            @RequestHeader(value = "X-Webhook-Secret", required = false) String secretHeader,
            @RequestParam(value = "secret", required = false) String secretParam,
            @RequestBody Map<String, Object> payload) {

        log.info("Received Google Form webhook payload: {}", payload);

        // Security check if secret is configured
        if (expectedSecret != null && !expectedSecret.isEmpty() && !"none".equalsIgnoreCase(expectedSecret)) {
            String providedSecret = secretHeader != null ? secretHeader : secretParam;
            if (providedSecret == null || !expectedSecret.equals(providedSecret)) {
                log.warn("Unauthorized webhook attempt with invalid secret");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Unauthorized: Invalid webhook secret token"));
            }
        }

        try {
            // Extract required fields
            String jobId = (String) payload.get("jobId");
            String email = (String) payload.get("email");

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing required field: email"));
            }

            email = email.trim().toLowerCase();

            // Resolve name fields
            String firstName = (String) payload.getOrDefault("firstName", "");
            String lastName = (String) payload.getOrDefault("lastName", "");
            if ((firstName == null || firstName.trim().isEmpty()) && payload.containsKey("name")) {
                String fullName = ((String) payload.get("name")).trim();
                String[] parts = fullName.split("\\s+", 2);
                firstName = parts[0];
                lastName = parts.length > 1 ? parts[1] : "";
            }
            if (firstName == null || firstName.trim().isEmpty()) {
                firstName = "Applicant";
            }

            // Lookup Job Title if jobId provided
            String jobTitle = "General Application";
            if (jobId != null && !jobId.trim().isEmpty()) {
                Optional<Map<String, Object>> jobOpt = db.findById("jobs", jobId);
                if (jobOpt.isPresent()) {
                    jobTitle = (String) jobOpt.get().getOrDefault("title", "General Application");
                }
            }

            // Check for duplicate application (same email & same jobId)
            List<Map<String, Object>> existingApplicants = db.findAll("applicants");
            for (Map<String, Object> existing : existingApplicants) {
                String exEmail = (String) existing.get("email");
                String exJobId = (String) existing.get("jobId");
                if (email.equalsIgnoreCase(exEmail) && (jobId == null || jobId.equals(exJobId))) {
                    log.info("Duplicate applicant skipped for email {} and jobId {}", email, jobId);
                    return ResponseEntity.ok(Map.of(
                            "success", true,
                            "duplicate", true,
                            "applicantId", existing.getOrDefault("id", ""),
                            "message", "Duplicate application received. Existing candidate record preserved."
                    ));
                }
            }

            // Parse skills
            Object skillsObj = payload.get("skills");
            List<String> skillsList = new ArrayList<>();
            if (skillsObj instanceof List<?>) {
                for (Object s : (List<?>) skillsObj) {
                    if (s != null) skillsList.add(s.toString().trim());
                }
            } else if (skillsObj instanceof String && !((String) skillsObj).trim().isEmpty()) {
                String[] parts = ((String) skillsObj).split(",");
                for (String p : parts) {
                    if (!p.trim().isEmpty()) skillsList.add(p.trim());
                }
            }

            // Build applicant object for Firestore
            Map<String, Object> applicantData = new HashMap<>();
            applicantData.put("firstName", firstName);
            applicantData.put("lastName", lastName);
            applicantData.put("email", email);
            applicantData.put("phone", payload.getOrDefault("phone", ""));
            applicantData.put("jobId", jobId != null ? jobId : "");
            applicantData.put("jobTitle", jobTitle);
            applicantData.put("appliedRole", jobTitle);
            applicantData.put("skills", skillsList);
            applicantData.put("yearsExperience", payload.getOrDefault("yearsExperience", 0));
            applicantData.put("education", payload.getOrDefault("education", ""));
            applicantData.put("currentCompany", payload.getOrDefault("currentCompany", ""));
            applicantData.put("linkedinUrl", payload.getOrDefault("linkedinUrl", ""));
            applicantData.put("githubUrl", payload.getOrDefault("githubUrl", ""));
            applicantData.put("resumeUrl", payload.getOrDefault("resumeUrl", ""));
            applicantData.put("notes", payload.getOrDefault("notes", "Submitted via Google Form"));

            // Preserve complete 1:1 spreadsheet row data
            Object rawResponses = payload.get("rawFormResponses");
            if (rawResponses == null) {
                rawResponses = payload.get("formData");
            }
            if (rawResponses == null) {
                rawResponses = payload;
            }
            applicantData.put("rawFormResponses", rawResponses);

            applicantData.put("source", "Google Form");
            applicantData.put("stage", "NEW");
            applicantData.put("rating", 0);
            applicantData.put("appliedDate", Instant.now().toString());

            Map<String, Object> created = db.create("applicants", applicantData);
            log.info("Successfully created applicant {} via Google Form webhook", created.get("id"));

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "duplicate", false,
                    "applicantId", created.get("id"),
                    "message", "Applicant application processed and saved successfully."
            ));

        } catch (Exception e) {
            log.error("Error processing Google Form webhook payload", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal Server Error: " + e.getMessage()));
        }
    }
}
