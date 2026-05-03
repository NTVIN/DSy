package com.todo.controller;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos(Authentication auth) {
        return ResponseEntity.ok(todoService.getAllTodos(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoResponse> getTodoById(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(todoService.getTodoById(id, auth.getName()));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            @Valid @RequestBody TodoRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(todoService.createTodo(request, auth.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            @Valid @RequestBody TodoRequest request,
            Authentication auth) {
        return ResponseEntity.ok(todoService.updateTodo(id, request, auth.getName()));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleComplete(
            @PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(todoService.toggleComplete(id, auth.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id, Authentication auth) {
        todoService.deleteTodo(id, auth.getName());
        return ResponseEntity.noContent().build();
    }
}