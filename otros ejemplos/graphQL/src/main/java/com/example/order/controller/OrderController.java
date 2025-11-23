package com.example.order.controller;

import com.example.order.dto.OrderInput;
import com.example.order.model.Order;
import com.example.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @QueryMapping
    public List<Order> orders() {
        return orderService.getAllOrders();
    }
    
    @QueryMapping
    public Order orderById(@Argument Long id) {
        return orderService.getOrderById(id);
    }
    
    @QueryMapping
    public List<Order> ordersByStatus(@Argument String status) {
        return orderService.getOrdersByStatus(status);
    }
    
    @QueryMapping
    public List<Order> ordersByCustomer(@Argument String customerName) {
        return orderService.getOrdersByCustomer(customerName);
    }
    
    @MutationMapping
    public Order createOrder(@Argument OrderInput input) {
        return orderService.createOrder(input);
    }
    
    @MutationMapping
    public Order updateOrder(@Argument Long id, @Argument OrderInput input) {
        return orderService.updateOrder(id, input);
    }
    
    @MutationMapping
    public Boolean deleteOrder(@Argument Long id) {
        return orderService.deleteOrder(id);
    }
}
