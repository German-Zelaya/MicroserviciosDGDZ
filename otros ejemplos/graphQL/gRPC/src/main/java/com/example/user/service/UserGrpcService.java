package com.example.user.service;

import com.example.user.grpc.*;
import com.example.user.model.User;
import com.example.user.repository.UserRepository;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

import java.util.List;
import java.util.Optional;

@GrpcService
@RequiredArgsConstructor
public class UserGrpcService extends UserServiceGrpc.UserServiceImplBase {
    
    private final UserRepository userRepository;
    
    @Override
    public void createUser(CreateUserRequest request, StreamObserver<UserResponse> responseObserver) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setAge(request.getAge());
        
        User saved = userRepository.save(user);
        
        UserResponse response = buildUserResponse(saved);
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
    
    @Override
    public void getUser(GetUserRequest request, StreamObserver<UserResponse> responseObserver) {
        Optional<User> user = userRepository.findById(request.getId());
        
        if (user.isPresent()) {
            responseObserver.onNext(buildUserResponse(user.get()));
        } else {
            responseObserver.onError(new RuntimeException("User not found"));
        }
        responseObserver.onCompleted();
    }
    
    @Override
    public void getAllUsers(Empty request, StreamObserver<UserListResponse> responseObserver) {
        List<User> users = userRepository.findAll();
        
        UserListResponse.Builder builder = UserListResponse.newBuilder();
        users.forEach(user -> builder.addUsers(buildUserResponse(user)));
        
        responseObserver.onNext(builder.build());
        responseObserver.onCompleted();
    }
    
    @Override
    public void updateUser(UpdateUserRequest request, StreamObserver<UserResponse> responseObserver) {
        Optional<User> existing = userRepository.findById(request.getId());
        
        if (existing.isPresent()) {
            User user = existing.get();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setAge(request.getAge());
            
            User updated = userRepository.save(user);
            responseObserver.onNext(buildUserResponse(updated));
        } else {
            responseObserver.onError(new RuntimeException("User not found"));
        }
        responseObserver.onCompleted();
    }
    
    @Override
    public void deleteUser(DeleteUserRequest request, StreamObserver<DeleteUserResponse> responseObserver) {
        if (userRepository.existsById(request.getId())) {
            userRepository.deleteById(request.getId());
            
            DeleteUserResponse response = DeleteUserResponse.newBuilder()
                    .setSuccess(true)
                    .setMessage("User deleted successfully")
                    .build();
            
            responseObserver.onNext(response);
        } else {
            DeleteUserResponse response = DeleteUserResponse.newBuilder()
                    .setSuccess(false)
                    .setMessage("User not found")
                    .build();
            
            responseObserver.onNext(response);
        }
        responseObserver.onCompleted();
    }
    
    private UserResponse buildUserResponse(User user) {
        return UserResponse.newBuilder()
                .setId(user.getId())
                .setName(user.getName())
                .setEmail(user.getEmail())
                .setAge(user.getAge())
                .build();
    }
}