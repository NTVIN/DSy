package com.todo.config;

import com.todo.entity.Todo;
import com.todo.entity.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final TodoRepository todoRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner seedDatabase() {
        return args -> {
            // Only seed if database is empty
            if (userRepository.count() > 0) {
                log.info("Database already contains data, skipping seeding");
                return;
            }

            log.info("Seeding database with initial data...");

            // Create test users
            User alice = User.builder()
                    .username("alice")
                    .email("alice@example.com")
                    .password(passwordEncoder.encode("Alice123!"))
                    .enabled(true)
                    .build();
            alice = userRepository.save(alice);
            log.info("Created user: alice@example.com (password: Alice123!)");

            User bob = User.builder()
                    .username("bob")
                    .email("bob@example.com")
                    .password(passwordEncoder.encode("Bob123!"))
                    .enabled(true)
                    .build();
            bob = userRepository.save(bob);
            log.info("Created user: bob@example.com (password: Bob123!)");

            User admin = User.builder()
                    .username("admin")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("Admin123!"))
                    .enabled(true)
                    .build();
            admin = userRepository.save(admin);
            log.info("Created user: admin@example.com (password: Admin123!)");

            // Create sample todos for Alice
            Todo todo1 = Todo.builder()
                    .title("Complete project documentation")
                    .description("Write README and API docs")
                    .completed(false)
                    .user(alice)
                    .build();
            todoRepository.save(todo1);

            Todo todo2 = Todo.builder()
                    .title("Prepare presentation")
                    .description("Create slides for demo")
                    .completed(true)
                    .user(alice)
                    .build();
            todoRepository.save(todo2);

            Todo todo3 = Todo.builder()
                    .title("Review code")
                    .description("Final code review before submission")
                    .completed(false)
                    .user(alice)
                    .build();
            todoRepository.save(todo3);

            log.info("Created 3 todos for alice");

            // Create sample todos for Bob
            Todo todo4 = Todo.builder()
                    .title("Buy groceries")
                    .description("Milk, eggs, bread")
                    .completed(false)
                    .user(bob)
                    .build();
            todoRepository.save(todo4);

            Todo todo5 = Todo.builder()
                    .title("Call dentist")
                    .description("Schedule appointment")
                    .completed(false)
                    .user(bob)
                    .build();
            todoRepository.save(todo5);

            log.info("Created 2 todos for bob");

            log.info("=".repeat(60));
            log.info("DATABASE SEEDING COMPLETED");
            log.info("=".repeat(60));
            log.info("Test Users Available:");
            log.info("  - alice@example.com / Alice123!");
            log.info("  - bob@example.com / Bob123!");
            log.info("  - admin@example.com / Admin123!");
            log.info("=".repeat(60));
        };
    }
}