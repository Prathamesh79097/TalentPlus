package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/applicants")
@RequiredArgsConstructor
public class ApplicantController {

    private final FirestoreService db;
    private static final String COLLECTION = "applicants";

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllApplicants(
            @RequestParam(required = false) String jobId,
            @RequestParam(required = false) String stages) throws Exception {

        List<Map<String, Object>> applicants;

        if (jobId != null && !jobId.isEmpty()) {
            applicants = db.findByField(COLLECTION, "jobId", jobId);
        } else {
            applicants = db.findAll(COLLECTION);
        }

        // Filter by stage(s)
        if (stages != null && !stages.isEmpty()) {
            List<String> stageList = Arrays.asList(stages.split(","));
            applicants = applicants.stream()
                    .filter(a -> {
                        String stage = (String) a.getOrDefault("stage", "NEW");
                        return stageList.contains(stage);
                    }).toList();
        }

        // Sort by applied date descending
        applicants.sort((a, b) -> {
            String da = (String) a.getOrDefault("createdAt", "");
            String db2 = (String) b.getOrDefault("createdAt", "");
            return db2.compareTo(da);
        });

        return ResponseEntity.ok(applicants);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getApplicant(@PathVariable String id) throws Exception {
        return db.findById(COLLECTION, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createApplicant(@RequestBody Map<String, Object> body) throws Exception {
        if (!body.containsKey("email") || !body.containsKey("firstName")) {
            return ResponseEntity.badRequest().build();
        }
        body.putIfAbsent("stage", "NEW");
        body.putIfAbsent("rating", 0);
        body.put("appliedDate", new Date().toInstant().toString());

        Map<String, Object> applicant = db.create(COLLECTION, body);
        return ResponseEntity.ok(applicant);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateApplicant(@PathVariable String id,
                                                                @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> updated = db.replace(COLLECTION, id, body);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<Map<String, Object>> updateStage(@PathVariable String id,
                                                            @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> patch = new HashMap<>();
        patch.put("stage", body.get("stage"));
        patch.put("stageUpdatedAt", new Date().toInstant().toString());
        Map<String, Object> updated = db.update(COLLECTION, id, patch);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/rating")
    public ResponseEntity<Map<String, Object>> updateRating(@PathVariable String id,
                                                             @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> patch = new HashMap<>();
        patch.put("rating", body.get("rating"));
        Map<String, Object> updated = db.update(COLLECTION, id, patch);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplicant(@PathVariable String id) throws Exception {
        Optional<Map<String, Object>> applicantOpt = db.findById(COLLECTION, id);
        if (applicantOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> applicant = applicantOpt.get();
        String jobId = (String) applicant.get("jobId");

        // 1. Cascade delete all subcollections (notes)
        try {
            List<Map<String, Object>> notes = db.findSubcollection(COLLECTION, id, "notes");
            for (Map<String, Object> note : notes) {
                String noteId = (String) note.get("id");
                if (noteId != null) {
                    db.deleteSubcollectionDocument(COLLECTION, id, "notes", noteId);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to delete subcollection notes for applicant {}: {}", id, e.getMessage());
        }

        // 2. Cascade delete all linked interviews
        try {
            List<Map<String, Object>> interviews = db.findByField("interviews", "candidateId", id);
            for (Map<String, Object> iv : interviews) {
                String ivId = (String) iv.get("id");
                if (ivId != null) {
                    db.delete("interviews", ivId);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to delete interviews for candidate {}: {}", id, e.getMessage());
        }

        // 3. Cascade delete all linked job offers
        try {
            List<Map<String, Object>> offers = db.findByField("offers", "candidateId", id);
            for (Map<String, Object> offer : offers) {
                String offerId = (String) offer.get("id");
                if (offerId != null) {
                    db.delete("offers", offerId);
                }
            }
        } catch (Exception e) {
            log.warn("Failed to delete offers for candidate {}: {}", id, e.getMessage());
        }

        // 4. Delete the applicant document itself from Firestore
        db.delete(COLLECTION, id);
        log.info("Completely deleted applicant {} and all associated roots", id);

        // 5. Recalculate job applicant count metrics
        if (jobId != null && !jobId.trim().isEmpty()) {
            try {
                long totalCount = db.countByField(COLLECTION, "jobId", jobId);
                long newCount = db.findAll(COLLECTION).stream()
                        .filter(a -> jobId.equals(a.get("jobId")) && "NEW".equals(a.get("stage")))
                        .count();
                db.update("jobs", jobId, Map.of(
                        "applicantCount", totalCount,
                        "newApplicants", newCount
                ));
            } catch (Exception e) {
                log.warn("Failed to update job counts for job {}: {}", jobId, e.getMessage());
            }
        }

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/all")
    public ResponseEntity<Map<String, Object>> deleteAllApplicants() throws Exception {
        List<Map<String, Object>> applicants = db.findAll(COLLECTION);
        int deletedCount = 0;
        for (Map<String, Object> a : applicants) {
            String id = (String) a.get("id");
            if (id != null) {
                // Delete notes
                try {
                    List<Map<String, Object>> notes = db.findSubcollection(COLLECTION, id, "notes");
                    for (Map<String, Object> note : notes) {
                        String noteId = (String) note.get("id");
                        if (noteId != null) db.deleteSubcollectionDocument(COLLECTION, id, "notes", noteId);
                    }
                } catch (Exception ignored) {}

                // Delete interviews
                try {
                    List<Map<String, Object>> ivs = db.findByField("interviews", "candidateId", id);
                    for (Map<String, Object> iv : ivs) {
                        String ivId = (String) iv.get("id");
                        if (ivId != null) db.delete("interviews", ivId);
                    }
                } catch (Exception ignored) {}

                // Delete offers
                try {
                    List<Map<String, Object>> offers = db.findByField("offers", "candidateId", id);
                    for (Map<String, Object> of : offers) {
                        String ofId = (String) of.get("id");
                        if (ofId != null) db.delete("offers", ofId);
                    }
                } catch (Exception ignored) {}

                db.delete(COLLECTION, id);
                deletedCount++;
            }
        }

        // Reset applicant counts for all jobs
        try {
            List<Map<String, Object>> jobs = db.findAll("jobs");
            for (Map<String, Object> job : jobs) {
                String jobId = (String) job.get("id");
                if (jobId != null) {
                    db.update("jobs", jobId, Map.of(
                        "applicantCount", 0,
                        "newApplicants", 0
                    ));
                }
            }
        } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of(
            "success", true,
            "deletedApplicants", deletedCount,
            "message", "All current applicants and their associated records removed successfully."
        ));
    }

    // ── Notes subcollection ──────────────────────────────────────────

    @GetMapping("/{id}/notes")
    public ResponseEntity<List<Map<String, Object>>> getNotes(@PathVariable String id) throws Exception {
        List<Map<String, Object>> notes = db.findSubcollection(COLLECTION, id, "notes");
        notes.sort((a, b) -> {
            String da = (String) a.getOrDefault("createdAt", "");
            String db2 = (String) b.getOrDefault("createdAt", "");
            return db2.compareTo(da);
        });
        return ResponseEntity.ok(notes);
    }

    @PostMapping("/{id}/notes")
    public ResponseEntity<Map<String, Object>> addNote(@PathVariable String id,
                                                        @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> note = db.createInSubcollection(COLLECTION, id, "notes", body);
        return ResponseEntity.ok(note);
    }
}
