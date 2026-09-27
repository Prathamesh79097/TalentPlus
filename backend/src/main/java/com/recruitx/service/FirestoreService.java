package com.recruitx.service;

import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

/**
 * Generic Firestore service for CRUD operations on any collection.
 */
@Slf4j
@Service
public class FirestoreService {

    private Firestore getFirestore() {
        return FirestoreClient.getFirestore();
    }

    /**
     * Create a new document with auto-generated ID.
     */
    public Map<String, Object> create(String collection, Map<String, Object> data)
            throws ExecutionException, InterruptedException {
        data.put("createdAt", new Date().toInstant().toString());
        data.put("updatedAt", new Date().toInstant().toString());

        DocumentReference docRef = getFirestore().collection(collection).document();
        data.put("id", docRef.getId());
        docRef.set(data).get();

        log.debug("Created document {} in collection {}", docRef.getId(), collection);
        return data;
    }

    /**
     * Create document with a specific ID.
     */
    public Map<String, Object> createWithId(String collection, String id, Map<String, Object> data)
            throws ExecutionException, InterruptedException {
        data.put("id", id);
        data.put("createdAt", new Date().toInstant().toString());
        data.put("updatedAt", new Date().toInstant().toString());

        getFirestore().collection(collection).document(id).set(data).get();
        return data;
    }

    /**
     * Get a document by ID.
     */
    public Optional<Map<String, Object>> findById(String collection, String id)
            throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = getFirestore().collection(collection).document(id).get().get();
        if (doc.exists()) {
            Map<String, Object> data = doc.getData();
            if (data != null) data.put("id", doc.getId());
            return Optional.ofNullable(data);
        }
        return Optional.empty();
    }

    /**
     * Get all documents in a collection.
     */
    public List<Map<String, Object>> findAll(String collection)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = getFirestore().collection(collection).get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    if (data != null) data.put("id", doc.getId());
                    return data;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Find documents by a single field value.
     */
    public List<Map<String, Object>> findByField(String collection, String field, Object value)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = getFirestore().collection(collection)
                .whereEqualTo(field, value).get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    if (data != null) data.put("id", doc.getId());
                    return data;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Find documents where field is in a list of values.
     */
    public List<Map<String, Object>> findByFieldIn(String collection, String field, List<Object> values)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = getFirestore().collection(collection)
                .whereIn(field, values).get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    if (data != null) data.put("id", doc.getId());
                    return data;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Update a document (merge/partial update).
     */
    public Map<String, Object> update(String collection, String id, Map<String, Object> data)
            throws ExecutionException, InterruptedException {
        data.put("updatedAt", new Date().toInstant().toString());
        data.remove("id");
        data.remove("createdAt");

        DocumentReference docRef = getFirestore().collection(collection).document(id);
        docRef.update(data).get();

        // Return updated document
        return findById(collection, id).orElse(data);
    }

    /**
     * Replace a document entirely.
     */
    public Map<String, Object> replace(String collection, String id, Map<String, Object> data)
            throws ExecutionException, InterruptedException {
        data.put("id", id);
        data.put("updatedAt", new Date().toInstant().toString());

        getFirestore().collection(collection).document(id).set(data).get();
        return data;
    }

    /**
     * Delete a document.
     */
    public void delete(String collection, String id)
            throws ExecutionException, InterruptedException {
        getFirestore().collection(collection).document(id).delete().get();
        log.debug("Deleted document {} from collection {}", id, collection);
    }

    /**
     * Count documents in a collection matching a field value.
     */
    public long countByField(String collection, String field, Object value)
            throws ExecutionException, InterruptedException {
        return getFirestore().collection(collection)
                .whereEqualTo(field, value).get().get().size();
    }

    /**
     * Get a subcollection.
     */
    public List<Map<String, Object>> findSubcollection(String collection, String docId, String subcollection)
            throws ExecutionException, InterruptedException {
        QuerySnapshot snapshot = getFirestore()
                .collection(collection).document(docId)
                .collection(subcollection).get().get();
        return snapshot.getDocuments().stream()
                .map(doc -> {
                    Map<String, Object> data = doc.getData();
                    if (data != null) data.put("id", doc.getId());
                    return data;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Create in subcollection.
     */
    public Map<String, Object> createInSubcollection(String collection, String docId,
                                                       String subcollection, Map<String, Object> data)
            throws ExecutionException, InterruptedException {
        data.put("createdAt", new Date().toInstant().toString());
        DocumentReference ref = getFirestore()
                .collection(collection).document(docId)
                .collection(subcollection).document();
        data.put("id", ref.getId());
        ref.set(data).get();
        return data;
    }
}
