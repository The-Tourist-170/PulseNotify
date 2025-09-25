package com.assignment.server.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.assignment.server.Dto.AuthRequest;
import com.assignment.server.Dto.AuthResponse;
import com.assignment.server.Model.Role;
import com.assignment.server.Model.User;
import com.assignment.server.Repository.TeamRepository;
import com.assignment.server.Repository.UserRepository;
import com.assignment.server.Service.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        if (userRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalStateException("User with username '" + request.getName() + "' already exists.");
        }

        var user = new User();
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); 
        if (request.getTeamId() != null) {
            teamRepository.findById(request.getTeamId()).ifPresent(user::setTeam);
        }
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword()));
        var user = userRepository.findByName(request.getName()).orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }
}