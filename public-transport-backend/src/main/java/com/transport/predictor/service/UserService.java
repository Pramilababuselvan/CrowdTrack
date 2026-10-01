package com.transport.predictor.service;

import com.transport.predictor.dto.LoginRequest;
import com.transport.predictor.dto.LoginResponse;
import com.transport.predictor.model.User;
import com.transport.predictor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public LoginResponse authenticate(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (userOpt.isEmpty()) {
            return LoginResponse.failure("Invalid email or password");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return LoginResponse.failure("Invalid email or password");
        }

        String mockToken = "token_" + UUID.randomUUID().toString().substring(0, 8);
        return new LoginResponse(
                true,
                "Authentication successful",
                mockToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
