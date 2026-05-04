package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.entity.Todo;
import com.todo.entity.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class TodoService {

    private final TodoRepository todoRepository;
    private final UserRepository userRepository;
    @Transactional(readOnly = true)
    public List<TodoResponse> getAllTodos(String username) {
        User user = getUser(username);
        return todoRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Transactional(readOnly = true)
    public TodoResponse getTodoById(Long id, String username) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return mapToResponse(todo);
    }

    public TodoResponse createTodo(TodoRequest request, String username) {
        User user = getUser(username);
        Todo todo = Todo.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .completed(false)
                .user(user)
                .build();
        todo = todoRepository.save(todo);
        log.info("Todo created: {} for user: {}", todo.getId(), username);
        return mapToResponse(todo);
    }

    public TodoResponse updateTodo(Long id, TodoRequest request, String username) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo = todoRepository.save(todo);
        return mapToResponse(todo);
    }

    public TodoResponse toggleComplete(Long id, String username) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todo.setCompleted(!todo.getCompleted());
        todo = todoRepository.save(todo);
        log.info("Todo {} marked as completed={}", id, todo.getCompleted());
        return mapToResponse(todo);
    }

    public void deleteTodo(Long id, String username) {
        User user = getUser(username);
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
        log.info("Todo deleted: {} by user: {}", id, username);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TodoResponse mapToResponse(Todo todo) {
        return TodoResponse.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .description(todo.getDescription())
                .completed(todo.getCompleted())
                .userId(todo.getUser().getId())
                .createdAt(todo.getCreatedAt())
                .updatedAt(todo.getUpdatedAt())
                .build();
    }
}