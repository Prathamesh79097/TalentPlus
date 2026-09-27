package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final FirestoreService db;
    private static final String COLLECTION = "jobs";

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllJobs(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String jobType) throws Exception {

        List<Map<String, Object>> jobs;

        if (status != null && !status.isEmpty()) {
            jobs = db.findByField(COLLECTION, "status", status);
        } else {
            jobs = db.findAll(COLLECTION);
        }

        // Filter by department
        if (department != null && !department.isEmpty()) {
            final String dept = department;
            jobs = jobs.stream().filter(j -> dept.equals(j.get("department"))).toList();
        }

        // Filter by jobType
        if (jobType != null && !jobType.isEmpty()) {
            final String type = jobType;
            jobs = jobs.stream().filter(j -> type.equals(j.get("jobType"))).toList();
        }

        // Enrich with applicant counts
        for (Map<String, Object> job : jobs) {
            String jobId = (String) job.get("id");
            long count = db.countByField("applicants", "jobId", jobId);
            job.put("applicantCount", count);
        }

        // Sort by creation date descending
        jobs.sort((a, b) -> {
            String da = (String) a.getOrDefault("createdAt", "");
            String db2 = (String) b.getOrDefault("createdAt", "");
            return db2.compareTo(da);
        });

        return ResponseEntity.ok(jobs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getJob(@PathVariable String id) throws Exception {
        return db.findById(COLLECTION, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createJob(@RequestBody Map<String, Object> body) throws Exception {
        // Validate required fields
        if (!body.containsKey("title") || !body.containsKey("department") || !body.containsKey("jobType")) {
            return ResponseEntity.badRequest().build();
        }
        body.put("postedDate", new Date().toInstant().toString());
        Map<String, Object> job = db.create(COLLECTION, body);
        return ResponseEntity.ok(job);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateJob(@PathVariable String id,
                                                          @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> updated = db.replace(COLLECTION, id, body);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchJob(@PathVariable String id,
                                                         @RequestBody Map<String, Object> body) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> updated = db.update(COLLECTION, id, body);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable String id) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        db.delete(COLLECTION, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/urgent")
    public ResponseEntity<List<Map<String, Object>>> getUrgentJobs() throws Exception {
        List<Map<String, Object>> openJobs = db.findByField(COLLECTION, "status", "OPEN");
        // Sort by days open (oldest first = most urgent)
        openJobs.sort((a, b) -> {
            String da = (String) a.getOrDefault("createdAt", "");
            String db2 = (String) b.getOrDefault("createdAt", "");
            return da.compareTo(db2);
        });
        // Add daysOpen field and applicant count
        for (Map<String, Object> job : openJobs) {
            String createdAt = (String) job.getOrDefault("createdAt", new Date().toInstant().toString());
            long daysOpen = (System.currentTimeMillis() - java.time.Instant.parse(createdAt).toEpochMilli()) / 86400000;
            job.put("daysOpen", daysOpen);
            long count = db.countByField("applicants", "jobId", (String) job.get("id"));
            job.put("applicants", count);
        }
        return ResponseEntity.ok(openJobs.stream().limit(5).toList());
    }
}
