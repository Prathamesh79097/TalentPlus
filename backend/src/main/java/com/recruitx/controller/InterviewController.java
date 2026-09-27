package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final FirestoreService db;
    private static final String COLLECTION = "interviews";

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllInterviews(
            @RequestParam(required = false) String candidateId,
            @RequestParam(required = false) String status) throws Exception {

        List<Map<String, Object>> interviews;

        if (candidateId != null && !candidateId.isEmpty()) {
            interviews = db.findByField(COLLECTION, "candidateId", candidateId);
        } else {
            interviews = db.findAll(COLLECTION);
        }

        if (status != null && !status.isEmpty()) {
            final String s = status;
            interviews = interviews.stream().filter(i -> s.equals(i.get("status"))).toList();
        }

        // Sort by scheduledAt
        interviews.sort((a, b) -> {
            String da = (String) a.getOrDefault("scheduledAt", "");
            String db2 = (String) b.getOrDefault("scheduledAt", "");
            return da.compareTo(db2);
        });

        return ResponseEntity.ok(interviews);
    }

    @GetMapping("/today")
    public ResponseEntity<List<Map<String, Object>>> getTodayInterviews() throws Exception {
        List<Map<String, Object>> all = db.findAll(COLLECTION);
        String today = new java.text.SimpleDateFormat("yyyy-MM-dd").format(new Date());

        List<Map<String, Object>> todayInterviews = all.stream()
                .filter(iv -> {
                    String scheduledAt = (String) iv.getOrDefault("scheduledAt", "");
                    return scheduledAt.startsWith(today);
                })
                .sorted(Comparator.comparing(iv -> (String) ((Map) iv).getOrDefault("scheduledAt", "")))
                .toList();

        return ResponseEntity.ok(todayInterviews);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getInterview(@PathVariable String id) throws Exception {
        return db.findById(COLLECTION, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInterview(@RequestBody Map<String, Object> body) throws Exception {
        if (!body.containsKey("candidateId") || !body.containsKey("scheduledAt")) {
            return ResponseEntity.badRequest().build();
        }
        body.putIfAbsent("status", "SCHEDULED");
        Map<String, Object> interview = db.create(COLLECTION, body);

        // Update applicant stage to INTERVIEW
        String candidateId = (String) body.get("candidateId");
        if (candidateId != null) {
            Map<String, Object> stagePatch = new HashMap<>();
            stagePatch.put("stage", "INTERVIEW");
            db.update("applicants", candidateId, stagePatch);
        }

        return ResponseEntity.ok(interview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateInterview(@PathVariable String id,
                                                                @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> updated = db.replace(COLLECTION, id, body);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Map<String, Object>> cancelInterview(@PathVariable String id) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> patch = Map.of("status", "CANCELLED");
        Map<String, Object> updated = db.update(COLLECTION, id, patch);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Map<String, Object>> completeInterview(@PathVariable String id,
                                                                   @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> patch = new HashMap<>(body);
        patch.put("status", "COMPLETED");
        patch.put("completedAt", new Date().toInstant().toString());
        Map<String, Object> updated = db.update(COLLECTION, id, patch);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable String id) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        db.delete(COLLECTION, id);
        return ResponseEntity.noContent().build();
    }
}
