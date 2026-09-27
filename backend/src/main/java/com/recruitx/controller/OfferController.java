package com.recruitx.controller;

import com.recruitx.service.FirestoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final FirestoreService db;
    private static final String COLLECTION = "offers";

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllOffers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String candidateId) throws Exception {

        List<Map<String, Object>> offers;

        if (candidateId != null && !candidateId.isEmpty()) {
            offers = db.findByField(COLLECTION, "candidateId", candidateId);
        } else {
            offers = db.findAll(COLLECTION);
        }

        if (status != null && !status.isEmpty()) {
            final String s = status;
            offers = offers.stream().filter(o -> s.equals(o.get("status"))).toList();
        }

        offers.sort((a, b) -> {
            String da = (String) a.getOrDefault("sentAt", "");
            String db2 = (String) b.getOrDefault("sentAt", "");
            return db2.compareTo(da);
        });

        return ResponseEntity.ok(offers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOffer(@PathVariable String id) throws Exception {
        return db.findById(COLLECTION, id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOffer(@RequestBody Map<String, Object> body) throws Exception {
        if (!body.containsKey("candidateId") || !body.containsKey("salary")) {
            return ResponseEntity.badRequest().build();
        }
        body.putIfAbsent("status", "PENDING");
        body.putIfAbsent("sentAt", new Date().toInstant().toString());

        Map<String, Object> offer = db.create(COLLECTION, body);

        // Move candidate to OFFER stage
        String candidateId = (String) body.get("candidateId");
        if (candidateId != null) {
            db.update("applicants", candidateId, Map.of("stage", "OFFER"));
        }

        return ResponseEntity.ok(offer);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(@PathVariable String id,
                                                             @RequestBody Map<String, Object> body) throws Exception {
        Optional<Map<String, Object>> existingOpt = db.findById(COLLECTION, id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> existing = existingOpt.get();
        String newStatus = (String) body.get("status");

        Map<String, Object> patch = new HashMap<>();
        patch.put("status", newStatus);
        patch.put("respondedAt", new Date().toInstant().toString());

        Map<String, Object> updated = db.update(COLLECTION, id, patch);

        // If accepted, move candidate to HIRED
        if ("ACCEPTED".equals(newStatus)) {
            String candidateId = (String) existing.get("candidateId");
            if (candidateId != null) {
                db.update("applicants", candidateId, Map.of("stage", "HIRED", "hiredAt", new Date().toInstant().toString()));
            }
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOffer(@PathVariable String id) throws Exception {
        if (db.findById(COLLECTION, id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        db.delete(COLLECTION, id);
        return ResponseEntity.noContent().build();
    }
}
