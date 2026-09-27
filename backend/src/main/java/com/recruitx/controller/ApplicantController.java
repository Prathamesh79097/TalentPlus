package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        db.delete(COLLECTION, id);
        return ResponseEntity.noContent().build();
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
