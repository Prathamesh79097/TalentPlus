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
            // Extract raw spreadsheet response map
            Map<String, Object> rawMap = extractRawMap(payload);
            Map<String, Object> cleanRawResponses = cleanRawResponses(rawMap);

            // Extract required email field
            String email = (String) payload.get("email");
            if (email == null || email.trim().isEmpty()) {
                email = findInMap(rawMap, "email", "mail", "e-mail");
            }

            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing required field: email. Please ensure your Google Form includes an Email field."));
            }

            email = email.trim().toLowerCase();
            String jobId = (String) payload.get("jobId");

            // Extract name fields
            String firstName = (String) payload.getOrDefault("firstName", "");
            String lastName = (String) payload.getOrDefault("lastName", "");

            if ((firstName == null || firstName.trim().isEmpty()) && payload.containsKey("name")) {
                String fullName = ((String) payload.get("name")).trim();
                String[] parts = fullName.split("\\s+", 2);
                firstName = parts[0];
                lastName = parts.length > 1 ? parts[1] : "";
            }

            if (firstName == null || firstName.trim().isEmpty()) {
                String foundName = findInMap(rawMap, "full name", "first name", "applicant name", "candidate name", "name");
                if (!foundName.isEmpty()) {
                    String[] parts = foundName.split("\\s+", 2);
                    firstName = parts[0];
                    lastName = parts.length > 1 ? parts[1] : "";
                }
            }

            if (firstName == null || firstName.trim().isEmpty()) {
                firstName = "Applicant";
            }

            // Phone
            String phone = (String) payload.getOrDefault("phone", "");
            if (phone == null || phone.trim().isEmpty()) {
                phone = findInMap(rawMap, "phone", "mobile", "contact", "number");
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
            if (skillsList.isEmpty()) {
                String foundSkills = findInMap(rawMap, "skill", "technologies", "expertise");
                if (!foundSkills.isEmpty()) {
                    for (String p : foundSkills.split(",")) {
                        if (!p.trim().isEmpty()) skillsList.add(p.trim());
                    }
                }
            }

            // Years of experience
            Object expObj = payload.getOrDefault("yearsExperience", 0);
            int yearsExp = 0;
            if (expObj instanceof Number) {
                yearsExp = ((Number) expObj).intValue();
            } else {
                String foundExp = findInMap(rawMap, "experience", "years of experience");
                try {
                    yearsExp = Integer.parseInt(foundExp.replaceAll("[^0-9]", ""));
                } catch (Exception ignored) {}
            }

            // Other fields
            String education = getOrFind(payload, rawMap, "education", "degree", "qualification");
            String currentCompany = getOrFind(payload, rawMap, "currentCompany", "company", "organization");
            String linkedinUrl = getOrFind(payload, rawMap, "linkedinUrl", "linkedin");
            String githubUrl = getOrFind(payload, rawMap, "githubUrl", "github", "portfolio");
            String resumeUrl = getOrFind(payload, rawMap, "resumeUrl", "resume", "cv");

            // Build applicant object for Firestore
            Map<String, Object> applicantData = new HashMap<>();
            applicantData.put("firstName", firstName);
            applicantData.put("lastName", lastName);
            applicantData.put("email", email);
            applicantData.put("phone", phone);
            applicantData.put("jobId", jobId != null ? jobId : "");
            applicantData.put("jobTitle", jobTitle);
            applicantData.put("appliedRole", jobTitle);
            applicantData.put("skills", skillsList);
            applicantData.put("yearsExperience", yearsExp);
            applicantData.put("education", education);
            applicantData.put("currentCompany", currentCompany);
            applicantData.put("linkedinUrl", linkedinUrl);
            applicantData.put("githubUrl", githubUrl);
            applicantData.put("resumeUrl", resumeUrl);
            applicantData.put("notes", payload.getOrDefault("notes", "Submitted via Google Form"));

            // Store complete 1:1 spreadsheet row data as rawFormResponses
            applicantData.put("rawFormResponses", cleanRawResponses);

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

    @SuppressWarnings("unchecked")
    private Map<String, Object> extractRawMap(Map<String, Object> payload) {
        if (payload.get("rawFormResponses") instanceof Map<?, ?>) {
            return (Map<String, Object>) payload.get("rawFormResponses");
        }
        if (payload.get("formData") instanceof Map<?, ?>) {
            return (Map<String, Object>) payload.get("formData");
        }
        if (payload.get("namedValues") instanceof Map<?, ?>) {
            return (Map<String, Object>) payload.get("namedValues");
        }
        // Fallback: exclude technical keys
        Map<String, Object> fallback = new LinkedHashMap<>(payload);
        fallback.remove("jobId");
        fallback.remove("source");
        fallback.remove("notes");
        return fallback;
    }

    private Map<String, Object> cleanRawResponses(Map<String, Object> rawMap) {
        Map<String, Object> cleaned = new LinkedHashMap<>();
        for (Map.Entry<String, Object> entry : rawMap.entrySet()) {
            String key = entry.getKey();
            Object val = entry.getValue();
            if (val instanceof List<?>) {
                List<?> list = (List<?>) val;
                if (list.isEmpty()) {
                    cleaned.put(key, "");
                } else if (list.size() == 1) {
                    cleaned.put(key, list.get(0) != null ? list.get(0).toString() : "");
                } else {
                    cleaned.put(key, String.join(", ", list.stream().filter(Objects::nonNull).map(Object::toString).toArray(String[]::new)));
                }
            } else if (val != null) {
                cleaned.put(key, val.toString());
            } else {
                cleaned.put(key, "");
            }
        }
        return cleaned;
    }

    private String getOrFind(Map<String, Object> payload, Map<String, Object> rawMap, String payloadKey, String... keywords) {
        String val = (String) payload.get(payloadKey);
        if (val != null && !val.trim().isEmpty()) {
            return val.trim();
        }
        return findInMap(rawMap, keywords);
    }

    private String findInMap(Map<String, Object> map, String... keywords) {
        for (String kw : keywords) {
            String target = kw.toLowerCase();
            for (Map.Entry<String, Object> entry : map.entrySet()) {
                String k = entry.getKey().toLowerCase();
                if (k.contains(target)) {
                    Object v = entry.getValue();
                    if (v instanceof List<?> && !((List<?>) v).isEmpty()) {
                        return ((List<?>) v).get(0).toString().trim();
                    } else if (v != null) {
                        return v.toString().trim();
                    }
                }
            }
        }
        return "";
    }
}

