package com.example.order.service;

import com.example.order.dto.OrderInput;
import com.example.order.model.Order;
import com.example.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository repository;
    
    public Order createOrder(OrderInput input) {
        Order order = new Order();
        order.setCustomerName(input.getCustomerName());
        order.setProductName(input.getProductName());
        order.setQuantity(input.getQuantity());
        order.setTotalPrice(input.getTotalPrice());
        order.setStatus(input.getStatus() != null ? input.getStatus() : "PENDING");
        return repository.save(order);
    }
    
    public List<Order> getAllOrders() {
        return repository.findAll();
    }
    
    public Order getOrderById(Long id) {
        return repository.findById(id).orElse(null);
    }
    
    public List<Order> getOrdersByStatus(String status) {
        return repository.findByStatus(status);
    }
    
    public List<Order> getOrdersByCustomer(String customerName) {
        return repository.findByCustomerName(customerName);
    }
    
    public Order updateOrder(Long id, OrderInput input) {
        return repository.findById(id)
                .map(order -> {
                    order.setCustomerName(input.getCustomerName());
                    order.setProductName(input.getProductName());
                    order.setQuantity(input.getQuantity());
                    order.setTotalPrice(input.getTotalPrice());
                    order.setStatus(input.getStatus());
                    return repository.save(order);
                })
                .orElse(null);
    }
    
    public boolean deleteOrder(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
