package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActivityController {

    private final FirestoreService db;

    @GetMapping("/activity/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity() throws Exception {
        List<Map<String, Object>> activities = db.findAll("activities");
        activities.sort((a, b) -> {
            String da = (String) a.getOrDefault("timestamp", "");
            String db2 = (String) b.getOrDefault("timestamp", "");
            return db2.compareTo(da);
        });
        return ResponseEntity.ok(activities.stream().limit(10).toList());
    }

    @GetMapping("/users/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        // This will be populated from Firebase token in a real implementation
        return ResponseEntity.ok(Map.of("status", "authenticated"));
    }

    @PostMapping("/users/profile")
    public ResponseEntity<Map<String, Object>> createUserProfile(@RequestBody Map<String, Object> body) throws Exception {
        String uid = (String) body.get("uid");
        if (uid == null) return ResponseEntity.badRequest().build();
        Map<String, Object> profile = db.createWithId("users", uid, body);
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/users/profile/{uid}")
    public ResponseEntity<Map<String, Object>> getUserProfile(@PathVariable String uid) throws Exception {
        return db.findById("users", uid)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
